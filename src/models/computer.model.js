const { Model } = require('objection');

class Computer extends Model {
    static get tableName() {
        return 'computers';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['hostname'],
            properties: {
                id: { type: 'string', format: 'uuid' },
                hostname: { type: 'string', minLength: 1 },
                ip_address: { type: 'string' },
                mac_address: { type: 'string' },
                os_name: { type: 'string' },
                os_version: { type: 'string' },
                status: { type: 'string', default: 'active' },
                last_seen: { type: 'string', format: 'date-time' },
                last_check_in: { type: 'string', format: 'date-time' }
            }
        };
    }

    static get relationMappings() {
        const { Installation } = require('./installation.model');
        const { Application } = require('./application.model');

        return {
            installations: {
                relation: Model.HasManyRelation,
                modelClass: Installation,
                join: {
                    from: 'computers.id',
                    to: 'installations.computer_id'
                }
            },
            applications: {
                relation: Model.ManyToManyRelation,
                modelClass: Application,
                join: {
                    from: 'computers.id',
                    through: {
                        from: 'installations.computer_id',
                        to: 'installations.application_id'
                    },
                    to: 'applications.id'
                }
            }
        };
    }
}

module.exports = { Computer };
