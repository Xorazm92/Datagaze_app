@Injectable()
export class SuperAdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async updateAdminStatus(adminId: string, status: string): Promise<Admin> {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    admin.status = status;
    return admin.save();
  }

  async deleteAdmin(adminId: string): Promise<void> {
    const result = await this.adminModel.deleteOne({ _id: adminId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Admin not found');
    }
  }
}