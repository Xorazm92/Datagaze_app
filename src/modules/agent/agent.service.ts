import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from 'nest-knexjs';
import { Knex } from 'knex';
import { BaseService } from 'src/common/utils/base.service';
import { CreateAgentDto, InstalledApp } from './dto/create.agent.dto';
import { ComputerInterface } from './entity/computer.interface';
import { AgentAuthService } from './service/agent.auth.service';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

@Injectable()
export class AgentService extends BaseService<ComputerInterface> {
    constructor(
        @InjectModel() protected readonly knex: Knex,
                @Inject(forwardRef(() => AgentAuthService)) private readonly authService: AgentAuthService,
    ) {
        super(knex, 'agents');
    }

    async createComputerAndReturnToken(
        data: CreateAgentDto,
    ): Promise<{ token: string; statusCode: number }> {
        const [isValidComp] = await this.knex('agents')
            .where('machine_id', data.machine_id)
            .update({
                ...data,
                last_connected: new Date(),
            })
            .returning('*');

        let statusCode: number;
        let result: ComputerInterface;

        if (!isValidComp) {
            [result] = await this.knex('agents')
                .insert({
                    ...data,
                    last_connected: new Date(),
                })
                .returning('*');
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
        await this.knex('installed_apps').delete().where('agent_id', computer.id);

        for (const item of data) {
            await this.knex('installed_apps').insert({
                ...item,
                agent_id: computer.id,
            });
        }
    }

    async getApplications(): Promise<InstalledApp[]> {
        return this.knex('installed_apps').select('*');
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
}