import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import knex from 'knex';
import config from '../../../knexfile';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const db = knex(config.development);
    try {
      const user = await db('admin')
        .where({ id: userId })
        .first();

      if (!user || user.role !== 'superadmin') {
        throw new UnauthorizedException('Only superadmins can perform this action');
      }

      return true;
    } finally {
      await db.destroy();
    }
  }
}
