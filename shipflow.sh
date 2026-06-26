#!/bin/bash
echo "Warning: ./shipflow.sh is deprecated. Use ./cli/shipflow.sh instead." >&2
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/cli/shipflow.sh" "$@"
