@Controller('api/super-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
@ApiTags('Super Admin')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Put('admins/:adminId/status')
  @ApiOperation({ summary: 'Update admin status' })
  async updateAdminStatus(
    @Param('adminId') adminId: string,
    @Body('status') status: string,
  ) {
    return this.superAdminService.updateAdminStatus(adminId, status);
  }

  @Delete('admins/:adminId')
  @ApiOperation({ summary: 'Delete admin' })
  async deleteAdmin(@Param('adminId') adminId: string) {
    return this.superAdminService.deleteAdmin(adminId);
  }
}