import { Controller, Post, Body } from '@nestjs/common';
import { DeploymentService } from './deployment.service';

@Controller('deployment')
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Post()
  async deploy(@Body() data: any) {
    return this.deploymentService.deploy(data);
  }
} 