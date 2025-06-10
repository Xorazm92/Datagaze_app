export class UpdateApplicationsDTO {
    name: string;
    version: string;
    size: number;
    app_id: string;
    is_installed?: boolean;
    agent_id?: string;
}