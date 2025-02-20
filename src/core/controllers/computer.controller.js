const { Computer } = require('../../models/computer.model');
const { Installation } = require('../../models/installation.model');
const { Application } = require('../../models/application.model');

class ComputerController {
    async getComputers(req, res) {
        try {
            const computers = await Computer.query()
                .select('*')
                .orderBy('hostname');

            res.json({
                status: 'success',
                data: computers
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    async getComputerApplications(req, res) {
        try {
            const { computer_id } = req.params;
            
            const installations = await Installation.query()
                .where('computer_id', computer_id)
                .withGraphFetched('application')
                .orderBy('install_date', 'desc');

            const applications = installations.map(inst => ({
                app_id: inst.application.id,
                name: inst.application.name,
                version: inst.version,
                install_date: inst.install_date
            }));

            res.json({
                status: 'success',
                data: applications
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    async installApplication(req, res) {
        try {
            const { computer_id } = req.params;
            const { app_name, version } = req.body;

            const computer = await Computer.query().findById(computer_id);
            if (!computer) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Computer not found'
                });
            }

            if (computer.status !== 'active') {
                return res.status(400).json({
                    status: 'error',
                    message: 'The selected computer is offline. Installation cannot proceed.'
                });
            }

            // Create or find application
            let application = await Application.query()
                .findOne({ name: app_name });

            if (!application) {
                application = await Application.query().insert({
                    name: app_name,
                    version: version
                });
            }

            // Create installation record
            await Installation.query().insert({
                computer_id,
                application_id: application.id,
                version,
                installed_by: req.admin.username
            });

            res.status(201).json({
                status: 'success',
                message: 'Installation initiated successfully',
                task_id: `task-${Date.now()}`
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    async updateApplication(req, res) {
        try {
            const { computer_id } = req.params;
            const { app_id, new_version } = req.body;

            const installation = await Installation.query()
                .where({
                    computer_id,
                    application_id: app_id,
                    status: 'active'
                })
                .first();

            if (!installation) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Application not found on the target computer'
                });
            }

            await Installation.query()
                .patch({
                    version: new_version,
                    updated_at: new Date()
                })
                .where('id', installation.id);

            res.json({
                status: 'success',
                message: 'Update process started successfully',
                task_id: `task-${Date.now()}`
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }

    async removeApplication(req, res) {
        try {
            const { computer_id } = req.params;
            const { app_id } = req.body;

            const installation = await Installation.query()
                .where({
                    computer_id,
                    application_id: app_id,
                    status: 'active'
                })
                .first();

            if (!installation) {
                return res.status(404).json({
                    status: 'error',
                    message: 'The specified application was not found on the computer'
                });
            }

            await Installation.query()
                .patch({
                    status: 'removed',
                    uninstall_date: new Date(),
                    updated_at: new Date()
                })
                .where('id', installation.id);

            res.json({
                status: 'success',
                message: 'Application removal started successfully',
                task_id: `task-${Date.now()}`
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
}

module.exports = new ComputerController();
