export class CreateAgentDto {
    machine_id: string;
    hostname: string;
    os: string;
    os_version: string;
    agent_version: string;
    is_active?: boolean;
    last_connected?: Date;
}

export interface InstalledApp {
    name: string;
    version: string;
    size: number;
    app_id: string;
    is_installed?: boolean;
}