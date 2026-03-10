#!/bin/bash
# DEPRECATED: Renamed to shipflow.sh
# This stub redirects for backwards compatibility.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$SCRIPT_DIR/shipflow.sh" "$@"
