import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/utils/base.service';
import db from 'src/config/database.config';
import { ENV } from 'src/config/env';
import { CreateAgentDto, InstalledApp } from './dto/create.agent.dto';
import { ComputerInterface } from './entity/computer.interface';
import { AgentAuthService } from './service/agent.auth.service';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class AgentService extends BaseService<ComputerInterface> {
    constructor(private readonly authService: AgentAuthService) {
        super('agents');
    }

    async createComputerAndReturnToken(
        data: CreateAgentDto,
    ): Promise<{ token: string; statusCode: number }> {
        const isValidComp = (
            await db('agents')
                .where('machine_id', data.machine_id)
                .update({
                    ...data,
                    last_connected: new Date(),
                })
                .returning('*')
        )[0];

        let statusCode: number;
        let result: ComputerInterface;

        if (!isValidComp) {
            result = (
                await db('agents')
                    .insert({
                        ...data,
                        last_connected: new Date(),
                    })
                    .returning('*')
            )[0];
            statusCode = 201;
        } else {
            result = isValidComp;
            statusCode = 200;
        }

        const agentTokenPayload = {
            id: result.id,
            hostname: result.hostname,
            os: result.os,
            os_version: result.os_version,
            machine_id: result.machine_id,
        };
        
        return {
            token: await this.authService.generateToken(agentTokenPayload),
            statusCode: statusCode,
        };
    }

    async updateApplications(
        data: InstalledApp[],
        computer: ComputerInterface,
    ): Promise<void> {
        await db('installed_apps').delete().where('agent_id', computer.id);

        for (const item of data) {
            await db('installed_apps').insert({
                ...item,
                agent_id: computer.id,
            });
        }
    }

    async getApplications(): Promise<InstalledApp[]> {
        return await db('installed_apps').select('*');
    }

    async executeCommand(command: string): Promise<string> {
        try {
            // Add security checks and command validation here
            if (command.toLowerCase().startsWith('ssh')) {
                // Handle SSH connection
                return 'SSH connection established';
            }

            const { stdout, stderr } = await execAsync(command);
            if (stderr) {
                throw new Error(stderr);
            }
            return stdout;
        } catch (error) {
            throw new Error(`Command execution failed: ${error.message}`);
        }
    }

    async executeCommand(command: string): Promise<string> {
        try {
            const { stdout, stderr } = await execAsync(command);
            if (stderr) {
                throw new Error(stderr);
            }
            return stdout;
        } catch (error) {
            throw new Error(`Command execution failed: ${error.message}`);
        }
    }
}
