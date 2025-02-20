const { Model } = require('objection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class Admin extends Model {
    static get tableName() {
        return 'admin';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'email', 'password'],
            properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string', minLength: 1 },
                username: { type: 'string', minLength: 3 },
                email: { type: 'string', format: 'email' },
                password: { type: 'string', minLength: 8 },
                role: { type: 'string', enum: ['admin', 'super_admin'] },
                status: { type: 'string', default: 'active' },
                last_login: { type: 'string', format: 'date-time' }
            }
        };
    }

    async $beforeInsert() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async $beforeUpdate() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async verifyPassword(password) {
        return bcrypt.compare(password, this.password);
    }

    generateToken() {
        return jwt.sign(
            { id: this.id, role: this.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    static get modifiers() {
        return {
            defaultSelect(builder) {
                builder.select('id', 'name', 'username', 'email', 'role', 'status', 'last_login');
            }
        };
    }
}

module.exports = { Admin };
