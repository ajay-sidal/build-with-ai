#!/bin/bash
# Vercel post-deploy script for zero-downtime

# Run database migrations atomically
npx prisma migrate deploy

# Optionally, clear cache or restart services if needed
# echo "Clearing cache..."
# ...

exit 0
