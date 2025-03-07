import { Injectable } from '@nestjs/common';

@Injectable()
export class DeploymentService {
  constructor() {}

  async deploy(data: any) {
    return { message: 'Deployment started', data };
  }
} 