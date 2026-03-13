#!/bin/bash
#
# 🛡️ THE SANCTUARY - ROLLBACK PROTOCOL
# Usage: ./scripts/rollback.sh [backup-name]
#
# If no backup specified, lists available backups and uses the most recent.
#

set -e

BACKUP_DIR=".backups"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  THE SANCTUARY - ROLLBACK PROTOCOL    ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}❌ ERROR: No backup directory found at $BACKUP_DIR${NC}"
    echo "Cannot proceed with rollback."
    exit 1
fi

# List available backups
BACKUPS=($(ls -1 "$BACKUP_DIR" 2>/dev/null))

if [ ${#BACKUPS[@]} -eq 0 ]; then
    echo -e "${RED}❌ ERROR: No backups found in $BACKUP_DIR${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Available Backups:${NC}"
for i in "${!BACKUPS[@]}"; do
    echo "   $((i+1)). ${BACKUPS[$i]}"
done
echo ""

# Determine which backup to use
if [ -n "$1" ]; then
    SELECTED_BACKUP="$1"
else
    # Use most recent (last in sorted list)
    SELECTED_BACKUP="${BACKUPS[-1]}"
    echo -e "${YELLOW}ℹ️  No backup specified. Using most recent: ${SELECTED_BACKUP}${NC}"
fi

BACKUP_PATH="$BACKUP_DIR/$SELECTED_BACKUP"

# Verify backup exists
if [ ! -d "$BACKUP_PATH" ]; then
    echo -e "${RED}❌ ERROR: Backup '$SELECTED_BACKUP' not found${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}⚠️  WARNING: This will overwrite the current src/ directory${NC}"
echo -e "${YELLOW}   Target backup: ${SELECTED_BACKUP}${NC}"
echo ""

# Check if src exists and create a pre-rollback backup
if [ -d "src" ]; then
    PRE_ROLLBACK_DIR="$BACKUP_DIR/pre_rollback_$(date +%Y%m%d_%H%M%S)"
    echo -e "${CYAN}📦 Creating pre-rollback snapshot...${NC}"
    mkdir -p "$PRE_ROLLBACK_DIR"
    cp -r src "$PRE_ROLLBACK_DIR/" 2>/dev/null || true
    echo -e "${GREEN}✓ Pre-rollback backup saved to: $PRE_ROLLBACK_DIR${NC}"
fi

# Perform the rollback
echo ""
echo -e "${CYAN}🔄 Initiating rollback...${NC}"
rm -rf src
cp -r "$BACKUP_PATH/src" ./

# Restore config files if they exist in backup
if [ -f "$BACKUP_PATH/package.json" ]; then
    cp "$BACKUP_PATH/package.json" ./
    echo -e "${GREEN}✓ Restored package.json${NC}"
fi

if [ -f "$BACKUP_PATH/tailwind.config.ts" ]; then
    cp "$BACKUP_PATH/tailwind.config.ts" ./
    echo -e "${GREEN}✓ Restored tailwind.config.ts${NC}"
fi

if [ -f "$BACKUP_PATH/tsconfig.json" ]; then
    cp "$BACKUP_PATH/tsconfig.json" ./
    echo -e "${GREEN}✓ Restored tsconfig.json${NC}"
fi

if [ -f "$BACKUP_PATH/next.config.js" ]; then
    cp "$BACKUP_PATH/next.config.js" ./
    echo -e "${GREEN}✓ Restored next.config.js${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✓ ROLLBACK COMPLETE                  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo "   1. Run 'npm run dev' to verify the restoration"
echo "   2. Check for any hydration errors"
echo "   3. If issues persist, use the pre-rollback backup"
echo ""
echo -e "${YELLOW}Pre-rollback snapshot: ${PRE_ROLLBACK_DIR:-N/A}${NC}"
