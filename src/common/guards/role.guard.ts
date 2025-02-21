import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AdminService } from '../../modules/admin/admin.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private adminService: AdminService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      return false;
    }
    console.log(this.adminService.isSuperAdmin(user.id))
    return this.adminService.isSuperAdmin(user.id);
  }
}
