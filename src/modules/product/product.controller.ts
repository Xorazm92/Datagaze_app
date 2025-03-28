
import { Controller, Post, Body, Param } from '@nestjs/common';
import { SystemRequirementsDto } from './dto/system-requirements.dto';
import { InstallationScriptDto } from './dto/installation-script.dto';

@Controller('products')
export class ProductController {
  @Post(':id/requirements')
  async setSystemRequirements(
    @Param('id') id: string,
    @Body() requirements: SystemRequirementsDto
  ) {
    return this.productService.setSystemRequirements(id, requirements);
  }

  @Post(':id/installation-script')
  async setInstallationScript(
    @Param('id') id: string,
    @Body() script: InstallationScriptDto
  ) {
    return this.productService.setInstallationScript(id, script);
  }
}
