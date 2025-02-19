# NestJS CLI o'rnatish
npm i -g @nestjs/cli

# Yangi loyiha yaratish
nest new base-app
cd base-app

# Kerakli paketlarni o'rnatish
npm install knex pg nest-knexjs dotenv
npm install -D @types/node

# Kerakli papkalarni yaratish
mkdir -p src/core/database/migrations
mkdir -p src/modules/admin
mkdir -p src/common/guards
mkdir -p src/common/interfaces