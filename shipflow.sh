#!/bin/bash

# ShipFlow - Development Environment Manager
# Manages Flox environments, PM2 processes, and Caddy reverse proxy
#
# Architecture:
#   lib.sh       — shared library (actions, utilities, ui_* wrappers)
#   menu_gum.sh  — pure gum menus (when gum is installed)
#   menu_bash.sh — pure bash menus (fallback)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/lib.sh"

# Load the right menu frontend
if [ "$HAS_GUM" = true ]; then
    source "$SCRIPT_DIR/menu_gum.sh"
else
    source "$SCRIPT_DIR/menu_bash.sh"
fi

# Main entry point
main() {
    local marker="$HOME/.shipflow_setup_done"

    if [ ! -f "$marker" ]; then
        clear
        print_header
        if ! check_prerequisites; then
            ui_pause "Appuie sur une touche pour quitter..."
            exit 1
        fi
        touch "$marker"
        ui_pause
    else
        if ! check_prerequisites "quiet"; then
            clear
            print_header
            check_prerequisites
            ui_pause "Appuie sur une touche pour quitter..."
            exit 1
        fi
    fi

    cleanup_orphan_projects

    if [ "$#" -gt 0 ]; then
        local shortcut_status=0
        run_menu_shortcut "$@" || shortcut_status=$?
        exit "$shortcut_status"
    else
        run_menu
    fi
}

main "$@"
