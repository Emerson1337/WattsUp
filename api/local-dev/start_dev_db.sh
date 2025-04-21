#!/bin/bash
set -e


docker-compose -f local-dev/mongodb/dev_db.yml up -d

echo "========================================"
echo "mongo db ready"
