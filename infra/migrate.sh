#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "Running customer migrations..."
pnpm --filter @sentinel/customer-service migration:run

echo "Running billing migrations..."
pnpm --filter @sentinel/billing-service migration:run

echo "Running ticket migrations..."
pnpm --filter @sentinel/ticket-service migration:run

echo "Migrations complete."
