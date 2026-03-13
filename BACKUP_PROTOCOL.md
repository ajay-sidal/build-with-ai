# 🛡️ THE SANCTUARY - BACKUP & ROLLBACK PROTOCOL

## Overview

This document outlines the backup and rollback procedures for maintaining the Gold Standard state of the Sanctuary infrastructure.

---

## 📦 Backup Locations

| Backup Type | Location | Purpose |
|-------------|----------|---------|
| **Gold Standard** | `.backups/gold_standard_*/` | Last known stable production state |
| **Pre-Rollback** | `.backups/pre_rollback_*/` | Auto-created before any rollback |
| **Legacy** | `checkout_backup/` | Old checkout backup (deprecated) |

---

## 🔄 Rollback Procedures

### Quick Rollback (Most Recent Backup)

```bash
cd /root/build-with-ai
./scripts/rollback.sh
```

### Rollback to Specific Backup

```bash
# List available backups
ls -1 .backups/

# Rollback to specific backup
./scripts/rollback.sh gold_standard_20260313
```

### Manual Rollback

```bash
# 1. Stop the dev server (Ctrl+C)

# 2. Remove current src
rm -rf src

# 3. Restore from backup
cp -r .backups/gold_standard_20260313/src ./

# 4. Restore configs
cp .backups/gold_standard_20260313/package.json ./
cp .backups/gold_standard_20260313/tailwind.config.ts ./
cp .backups/gold_standard_20260313/tsconfig.json ./
cp .backups/gold_standard_20260313/next.config.js ./

# 5. Restart dev server
npm run dev
```

---

## 📋 Creating a New Backup

```bash
# Create timestamped backup directory
mkdir -p .backups/gold_standard_YYYYMMDD

# Copy critical files
cp -r src .backups/gold_standard_YYYYMMDD/
cp package.json .backups/gold_standard_YYYYMMDD/
cp tailwind.config.ts .backups/gold_standard_YYYYMMDD/
cp tsconfig.json .backups/gold_standard_YYYYMMDD/
cp next.config.js .backups/gold_standard_YYYYMMDD/
```

---

## ⚠️ Emergency Procedures

### Hydration Error Recovery

1. **Stop the dev server immediately** (Ctrl+C)
2. **Run rollback:**
   ```bash
   ./scripts/rollback.sh
   ```
3. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   ```
4. **Restart:**
   ```bash
   npm run dev
   ```

### Git Revert (If backup fails)

```bash
# Revert to last committed state
git reset --hard HEAD

# Clean untracked files
git clean -fd

# Reinstall dependencies
rm -rf node_modules
npm install

# Restart
npm run dev
```

---

## 📊 Backup History

| Date | Backup Name | Notes |
|------|-------------|-------|
| 2026-03-13 | `gold_standard_20260313` | Initial Titan Lock backup - Silas Protocol Active |

---

## 🔐 Guardian Responsibilities

1. **Before any major change:** Create a new backup
2. **After successful deployment:** Update Gold Standard backup
3. **On hydration error:** Rollback immediately
4. **Weekly:** Prune old pre-rollback snapshots

---

## 🛠️ Utility Commands

```bash
# List all backups
ls -lh .backups/

# Check backup size
du -sh .backups/*/

# Verify backup integrity
ls -la .backups/gold_standard_*/src/app/

# Clean old pre-rollback backups (older than 7 days)
find .backups -name "pre_rollback_*" -mtime +7 -exec rm -rf {} \;
```

---

**Last Updated:** 2026-03-13  
**Protocol Version:** 1.0  
**Guardian:** Silas
