# License and Application Management System

A NestJS-based system for managing licenses and applications across multiple computers.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Password update and profile management
- Role-based access control (Super Admin, Admin, User)

### Computer Management
- List all computers with their status
- View installed applications on computers
- Install new applications
- Update existing applications
- Remove applications

### License Management
- View installed products and their licenses
- Upload and update license files
- Monitor license usage and limits
- Get alerts for license expiration

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd base-app-main
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

4. Run database migrations:
```bash
npm run migration:run
```

5. Start the application:
```bash
npm run start:dev
```

### Initial Setup

1. Create a Super Admin account:
```bash
POST /api/super-admin/setup
{
  "username": "superadmin",
  "password": "StrongPass123!"
}
```

2. Login as Super Admin:
```bash
POST /api/auth/login
{
  "username": "superadmin",
  "password": "StrongPass123!"
}
```

## Testing with Postman

1. Import the Postman collection:
   - Open Postman
   - Click "Import" button
   - Select `Base-App.postman_collection.json`

2. Set up environment variables in Postman:
   - Create a new environment
   - Add variables:
     - `baseUrl`: `http://localhost:3000`
     - `token`: JWT token (will be automatically set after login)

3. Test the endpoints:
   1. First run "Setup Super Admin" request
   2. Then run "Login" request to get the token
   3. The token will be automatically set for other requests

## API Documentation

### Main Endpoints

#### Authentication
- `POST06
 /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `PUT /api/auth/password` - Update password
- `PUT /api/auth/profile` - Update profile

#### Super Admin
- `POST /api/super-admin/setup` - Create super admin (one-time)
- `POST /api/super-admin/admins` - Create new admin
- `GET /api/super-admin/admins` - List all admins
- `PUT /api/super-admin/admins/:adminId/status` - Update admin status
- `DELETE /api/super-admin/admins/:adminId` - Delete admin

#### Computers
- `GET /api/computers` - List all computers
- `GET /api/computers/:computerId/applications` - List installed applications
- `POST /api/computers/:computerId/applications/install` - Install application
- `PUT /api/computers/:computerId/applications/update` - Update application
- `DELETE /api/computers/:computerId/applications/remove` - Remove application

#### Licenses
- `GET /api/licenses/products` - List installed products
- `POST /api/licenses/upload` - Upload license file
- `GET /api/licenses/alerts/exceed` - Check license exceed alerts
- `GET /api/licenses/alerts/deadline` - Check license deadline alerts

### Response Formats

#### Success Response
```json
{
  "status": "success",
  "data": {...}
}
```

#### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Unprocessable Entity
- 500: Internal Server Error

## License

This project is licensed under the MIT License.
