#!/bin/sh

set -e

# Executa as migrações a partir do package @repo/db
echo "Running database migrations..."
cd /app/packages/database
npx prisma migrate deploy

# Inicia a aplicação
echo "Starting application..."
cd /app
node apps/api/dist/src/main.js