import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject
} from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { GetProductsDto, UploadLicenseDto } from './dto/license.dto';
import { AlertType  , LicenseAlertDto } from './dto/license-alert.dto';

@Injectable()
export class LicensesService {
  constructor(
    @InjectConnection() private readonly knex: Knex,
    @Inject('NotificationGateway') private readonly notificationGateway: any
  ) {}

  async getInstalledProducts(dto: GetProductsDto) {
    const computer = await this.knex('computers')
      .where('id', dto.server_id)
      .first();

    if (!computer) {
      throw new NotFoundException('Server not found');
    }

    const products = await this.knex('installations')
      .join('applications', 'installations.application_id', 'applications.id')
      .join('licenses', 'installations.license_id', 'licenses.id')
      .where('installations.computer_id', dto.server_id)
      .select(
        'applications.name as product_name',
        'installations.version',
        'licenses.license_key',
        'licenses.status as license_status',
        'licenses.expiry_date as expiration_date',
      );

    return {
      status: 'success',
      server_id: dto.server_id,
      products,
    };
  }

  async uploadLicense(dto: UploadLicenseDto, file: Express.Multer.File) {
    // Create alert for successful license upload
    await this.createAlert({
      productId: dto.product_name,
      alertType: AlertType.LICENSE_UPDATE,
      message: `License updated for ${dto.product_name}`,
    });
    if (!file || !file.originalname.endsWith('.lic')) {
      throw new BadRequestException('Invalid license file format');
    }

    const computer = await this.knex('computers')
      .where('id', dto.server_id)
      .first();

    if (!computer) {
      throw new NotFoundException('Server not found');
    }

    const application = await this.knex('applications')
      .where('name', dto.product_name)
      .first();

    if (!application) {
      throw new NotFoundException('Product not found');
    }

    // Here you would process the license file and extract necessary information
    // For demonstration, we'll just create a new license record
    await this.knex('licenses')
      .where({
        application_id: application.id,
      })
      .update({
        status: 'inactive',
      });

    await this.knex('licenses').insert({
      application_id: application.id,
      license_key: 'NEW-LICENSE-KEY', // This would come from the license file
      seats: 10, // This would come from the license file
      start_date: new Date(),
      expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      status: 'active',
    });

    return {
      status: 'success',
      message: 'License updated successfully',
    };
  }

  private async createAlert(alert: LicenseAlertDto) {
    // Save alert to database
    const [savedAlert] = await this.knex('license_alerts')
      .insert({
        product_id: alert.productId,
        alert_type: alert.alertType,
        message: alert.message,
        created_at: new Date()
      })
      .returning('*');

    // Send alert via WebSocket
    this.notificationGateway.emit('license_alert', {
      id: savedAlert.id,
      type: alert.alertType,
      message: alert.message,
      timestamp: savedAlert.created_at
    });

    return savedAlert;
  }

  async checkLicenseExceed() {
    const exceedingLicenses = await this.knex('licenses')
      .join('applications', 'licenses.application_id', 'applications.id')
      .join(
        'installations',
        'licenses.application_id',
        'installations.application_id',
      )
      .groupBy('licenses.id', 'applications.name', 'licenses.seats')
      .havingRaw('COUNT(installations.id) > licenses.seats')
      .select(
        'applications.name as product_name',
        'licenses.seats as allowed_instances',
        this.knex.raw('COUNT(installations.id) as current_instances'),
      );

    for (const license of exceedingLicenses) {
      await this.createAlert({
        productId: license.product_name,
        alertType: AlertType.LICENSE_EXCEED,
        message: `License limit exceeded for '${license.product_name}'. Allowed: ${license.allowed_instances}, Used: ${license.current_instances}.`
      });
    }

    return exceedingLicenses.map((license) => ({
      status: 'alert',
      type: 'license_exceed',
      message: `License limit exceeded for '${license.product_name}'. Allowed: ${license.allowed_instances}, Used: ${license.current_instances}.`,
    }));
  }

  async checkLicenseDeadline() {
    const warningThreshold = 7; // days
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + warningThreshold);

    const expiringLicenses = await this.knex('licenses')
      .join('applications', 'licenses.application_id', 'applications.id')
      .where('licenses.expiry_date', '<=', warningDate)
      .where('licenses.status', 'active')
      .select(
        'applications.name as product_name',
        'licenses.expiry_date as expiration_date',
      );

    for (const license of expiringLicenses) {
      const daysRemaining = Math.ceil(
        (new Date(license.expiration_date).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      );

      await this.createAlert({
        productId: license.product_name,
        alertType: AlertType.LICENSE_DEADLINE,
        message: `License for '${license.product_name}' will expire in ${daysRemaining} days. Please renew.`,
        daysRemaining
      });
    }

    return expiringLicenses.map((license) => {
      const daysRemaining = Math.ceil(
        (new Date(license.expiration_date).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      );

      return {
        status: 'alert',
        type: 'license_deadline',
        message: `License for '${license.product_name}' will expire in ${daysRemaining} days. Please renew.`,
      };
    });
  }
}
