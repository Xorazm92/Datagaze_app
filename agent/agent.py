
import os
import platform
import json
import psutil
import websockets
import asyncio
import jwt
import requests
from typing import List, Dict

class Agent:
    def __init__(self, server_url: str = "ws://0.0.0.0:3000/agent"):
        self.server_url = server_url
        self.token = None
        
    async def register(self):
        """Register agent with server and get token"""
        system_info = self._get_system_info()
        
        response = requests.post(
            "http://0.0.0.0:3000/v1/agent/create",
            json=system_info
        )
        
        if response.status_code in (200, 201):
            self.token = response.json()["token"]
            return True
        return False

    def _get_system_info(self) -> Dict:
        """Get system information"""
        info = {
            "hostname": platform.node(),
            "operation_system": platform.system(),
            "platform": platform.platform(),
            "build_number": platform.version(),
            "network_adapters": self._get_network_info(),
            "disks": self._get_disk_info()
        }
        return info

    def _get_network_info(self) -> List[Dict]:
        """Get network adapters information"""
        net_info = []
        for interface, addrs in psutil.net_if_addrs().items():
            for addr in addrs:
                if addr.family == psutil.AF_LINK:
                    net_info.append({
                        "name": interface,
                        "mac_address": addr.address
                    })
        return net_info

    def _get_disk_info(self) -> List[Dict]:
        """Get disk information"""
        disks = []
        for partition in psutil.disk_partitions():
            usage = psutil.disk_usage(partition.mountpoint)
            disks.append({
                "device": partition.device,
                "mountpoint": partition.mountpoint,
                "total": usage.total,
                "used": usage.used,
                "free": usage.free
            })
        return disks

    def _get_installed_apps(self) -> List[Dict]:
        """Get list of installed applications"""
        apps = []
        if platform.system() == "Windows":
            import winreg
            keys = [
                winreg.HKEY_LOCAL_MACHINE,
                winreg.HKEY_CURRENT_USER
            ]
            sub_key = r"Software\Microsoft\Windows\CurrentVersion\Uninstall"
            
            for hkey in keys:
                try:
                    key = winreg.OpenKey(hkey, sub_key, 0, winreg.KEY_READ)
                    for i in range(winreg.QueryInfoKey(key)[0]):
                        try:
                            subkey_name = winreg.EnumKey(key, i)
                            subkey = winreg.OpenKey(key, subkey_name)
                            try:
                                name = winreg.QueryValueEx(subkey, "DisplayName")[0]
                                version = winreg.QueryValueEx(subkey, "DisplayVersion")[0]
                                apps.append({
                                    "name": name,
                                    "version": version,
                                    "size": 0,
                                    "app_id": f"{name}-{version}"
                                })
                            except:
                                continue
                        except:
                            continue
                except:
                    continue
        elif platform.system() == "Linux":
            # For Linux using dpkg or rpm
            if os.path.exists("/var/lib/dpkg/status"):
                with open("/var/lib/dpkg/status") as f:
                    pkg = {}
                    for line in f:
                        if line.startswith("Package: "):
                            pkg["name"] = line.split(": ")[1].strip()
                        elif line.startswith("Version: "):
                            pkg["version"] = line.split(": ")[1].strip()
                            pkg["app_id"] = f"{pkg['name']}-{pkg['version']}"
                            pkg["size"] = 0
                            apps.append(pkg.copy())
        
        return apps

    async def update_applications(self):
        """Send installed applications list to server"""
        apps = self._get_installed_apps()
        
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.post(
            "http://0.0.0.0:3000/v1/agent/v1/applications",
            json=apps,
            headers=headers
        )
        return response.status_code == 200

    async def connect(self):
        """Connect to websocket server"""
        if not self.token:
            if not await self.register():
                return
                
        headers = {"Authorization": f"Bearer {self.token}"}
        
        async with websockets.connect(self.server_url, extra_headers=headers) as websocket:
            await self.update_applications()
            
            while True:
                try:
                    message = await websocket.recv()
                    await self._handle_message(message, websocket)
                except websockets.exceptions.ConnectionClosed:
                    break
                except Exception as e:
                    print(f"Error: {e}")
                    break

    async def _handle_message(self, message: str, websocket):
        """Handle incoming websocket messages"""
        try:
            data = json.loads(message)
            command = data.get("command")
            
            if command == "uninstall":
                apps = data.get("apps", [])
                # Implement uninstall logic
                success = True
                await websocket.send(json.dumps({
                    "type": "uninstall_response",
                    "success": success
                }))
            
            elif command == "install":
                app_info = data.get("app")
                # Implement install logic
                success = True
                await websocket.send(json.dumps({
                    "type": "install_response",
                    "success": success
                }))
            
            elif command == "update_agent":
                version = data.get("version")
                # Implement agent update logic
                success = True
                await websocket.send(json.dumps({
                    "type": "update_response",
                    "success": success
                }))

        except Exception as e:
            await websocket.send(json.dumps({
                "type": "error",
                "message": str(e)
            }))

async def main():
    agent = Agent()
    while True:
        try:
            await agent.connect()
        except Exception as e:
            print(f"Connection error: {e}")
        await asyncio.sleep(5)  # Retry after 5 seconds

if __name__ == "__main__":
    asyncio.run(main())
