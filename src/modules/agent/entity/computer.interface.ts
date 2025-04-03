export interface ComputerInterface {
    id: string;
    machine_id: string;
    hostname: string;
    os: string;
    os_version: string;
    agent_version: string;
    is_active: boolean;
    last_connected?: Date;
    created_at?: Date;
    updated_at?: Date;
}