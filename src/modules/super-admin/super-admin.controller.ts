@Controller('api/super-admin')
export class SuperAdminController {
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