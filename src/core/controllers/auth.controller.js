const { Admin } = require('../../models/admin.model');

class AuthController {
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const admin = await Admin.query().findOne({ username });

            if (!admin || !(await admin.verifyPassword(password))) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Invalid username or password'
                });
            }

            if (admin.status !== 'active') {
                return res.status(401).json({
                    status: 'error',
                    message: 'Account is not active'
                });
            }

            await Admin.query()
                .patch({ last_login: new Date() })
                .where('id', admin.id);

            const token = admin.generateToken();

            res.json({
                status: 'success',
                token
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    async register(req, res) {
        try {
            const { username, email, password, name } = req.body;

            const admin = await Admin.query().insert({
                username,
                email,
                password,
                name,
                role: 'admin'
            });

            res.status(201).json({
                status: 'success',
                message: 'User registered successfully'
            });
        } catch (error) {
            if (error.code === '23505') { // Unique constraint violation
                return res.status(400).json({
                    status: 'error',
                    message: 'Username or email already taken'
                });
            }
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    async updateProfile(req, res) {
        try {
            const { name, email } = req.body;
            const admin = req.admin;

            await Admin.query()
                .patch({ name, email, updated_at: new Date() })
                .where('id', admin.id);

            res.json({
                status: 'success',
                message: 'Profile updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    async updatePassword(req, res) {
        try {
            const { old_password, new_password } = req.body;
            const admin = await Admin.query().findById(req.admin.id);

            if (!(await admin.verifyPassword(old_password))) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Current password is incorrect'
                });
            }

            await Admin.query()
                .patch({ 
                    password: new_password,
                    updated_at: new Date()
                })
                .where('id', admin.id);

            res.json({
                status: 'success',
                message: 'Password updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}

module.exports = new AuthController();
