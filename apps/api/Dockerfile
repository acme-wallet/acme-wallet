###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:22-slim AS development

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

# Create app directory
WORKDIR /app

# Copy workspace config and lockfile first (cache-friendly layer)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./

# Copy all package.json files
COPY apps/api/package.json apps/api/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/schemas/package.json packages/schemas/package.json
COPY packages/lint-config/package.json packages/lint-config/package.json

# Install app dependencies
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

# Generate Prisma client
ENV DATABASE_URL="postgresql://dummy:5432/dummy"
RUN pnpm --filter @repo/db run db:generate

CMD [ "pnpm", "--filter", "api", "run", "start:dev" ]

###################
# BUILD FOR PRODUCTION
###################

# Stage 1: Install production dependencies
FROM node:22-slim AS production-deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/schemas/package.json packages/schemas/package.json
COPY packages/lint-config/package.json packages/lint-config/package.json

# Install ONLY production dependencies (--ignore-scripts skips husky prepare)
RUN pnpm install --prod --no-frozen-lockfile --ignore-scripts

# Stage 2: Build the application
FROM node:22-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.29.2 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/database/package.json packages/database/package.json
COPY packages/schemas/package.json packages/schemas/package.json
COPY packages/lint-config/package.json packages/lint-config/package.json

# Install all dependencies (including dev) for build tools and prisma CLI
RUN pnpm install --frozen-lockfile

COPY . .

# Generate Prisma client (output: packages/database/generated/prisma)
ENV DATABASE_URL="postgresql://dummy:5432/dummy"
RUN pnpm --filter @repo/db run db:generate

# Build the API and its workspace dependencies only (not web)
RUN pnpm --filter api... run build

###################
# PRODUCTION
###################

FROM node:22-slim AS production

WORKDIR /app

# Install OpenSSL (required by Prisma query engine)
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy production node_modules from production-deps stage
COPY --chown=node:node --from=production-deps /app/node_modules ./node_modules
COPY --chown=node:node --from=production-deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --chown=node:node --from=production-deps /app/packages/database/node_modules ./packages/database/node_modules
COPY --chown=node:node --from=production-deps /app/packages/schemas/node_modules ./packages/schemas/node_modules

# Copy the generated Prisma client from the build stage
COPY --chown=node:node --from=build /app/packages/database/generated ./packages/database/generated

# Copy built applications and packages
COPY --chown=node:node --from=build /app/apps/api/dist ./apps/api/dist
COPY --chown=node:node --from=build /app/packages/database/dist ./packages/database/dist
COPY --chown=node:node --from=build /app/packages/schemas/dist ./packages/schemas/dist

# Copy Prisma schema and migrations (needed for migrate deploy)
COPY --chown=node:node --from=build /app/packages/database/prisma ./packages/database/prisma
COPY --chown=node:node --from=build /app/packages/database/prisma.config.ts ./packages/database/prisma.config.ts

# Copy package.json files (needed for pnpm workspace resolution)
COPY --chown=node:node --from=build /app/package.json ./package.json
COPY --chown=node:node --from=build /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --chown=node:node --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --chown=node:node --from=build /app/packages/database/package.json ./packages/database/package.json
COPY --chown=node:node --from=build /app/packages/schemas/package.json ./packages/schemas/package.json

# Copy entrypoint script
COPY --chown=node:node apps/api/entrypoint.sh ./apps/api/entrypoint.sh

ENV NODE_ENV=production

# Set the correct permissions
RUN chmod +x ./apps/api/entrypoint.sh

# Run as non-root user
USER node

EXPOSE 3000

# Start the server using the production build
ENTRYPOINT [ "./apps/api/entrypoint.sh" ]