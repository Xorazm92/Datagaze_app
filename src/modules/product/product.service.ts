export class ProductService {
  async addSystemRequirements(productId: string, requirements: SystemRequirementsDto) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.systemRequirements = requirements;
    return product.save();
  }

  async addInstallationScript(productId: string, script: InstallationScriptDto) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.installationScript = script;
    return product.save();
  }
}