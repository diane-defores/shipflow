#!/bin/bash
# ShipFlow — Pure bash menu (no gum dependency)
# Sourced by shipflow.sh when gum is NOT available

_bash_flush_stdin() {
    if [ -r /dev/tty ]; then
        while read -rsn1 -t 0.05 _ < /dev/tty 2>/dev/null; do :; done
    fi
}

# Display menu items from array with sections and read choice
_bash_run_menu() {
    local action_display_mode="${1:-inline}"
    shift || true
    local items=("$@")

    local keys=()
    local labels=()
    local actions=()
    local item_count=0

    for item in "${items[@]}"; do
        local key label action
        key=$(echo "$item" | cut -d'|' -f1)
        label=$(echo "$item" | cut -d'|' -f2)
        action=$(echo "$item" | cut -d'|' -f3)

        if [ "$key" = "---" ]; then
            [ "$item_count" -gt 0 ] && echo ""
            echo -e "${BLUE}${label}${NC}"
        else
            echo -e "  ${CYAN}${key})${NC} ${label}"
            keys+=("$key")
            labels+=("$label")
            actions+=("$action")
            ((item_count++))
        fi
    done
    echo ""
    echo -e "${YELLOW}Your choice:${NC} \c"

    local choice
    ui_read_choice choice

    for ((j=0; j<${#keys[@]}; j++)); do
        local k
        k=$(echo "${keys[$j]}" | tr '[:upper:]' '[:lower:]')
        if [ "$choice" = "$k" ]; then
            local label="${labels[$j]}"
            local act="${actions[$j]}"
            [ "$act" = "__EXIT__" ] && return 1
            ui_run_menu_action "$label" "$act" "$action_display_mode"
            return 0
        fi
    done

    if [ -n "$choice" ]; then
        echo -e "${RED}Invalid option${NC}"
    fi
    return 0
}

# Advanced menu — loop with bash
action_advanced() {
    while true; do
        clear
        echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
        echo -e "                 ${YELLOW}Advanced Options${NC}"
        echo -e "${CYAN}══════════════════════════════════════════════════${NC}"
        echo ""

        _bash_run_menu "inline" "${ADVANCED_MENU_ITEMS[@]}"
        local rc=$?
        [ $rc -eq 1 ] && break
        if [ $rc -eq 0 ]; then
            if ui_should_skip_next_pause; then
                continue
            fi
            ui_pause "Appuie sur une touche pour continuer..."
        fi
    done
}

# Main menu loop — pure bash
run_menu() {
    while true; do
        clear
        print_header

        _bash_run_menu "screen" "${MAIN_MENU_ITEMS[@]}"
        local rc=$?
        if [ $rc -eq 0 ]; then
            if ui_should_skip_next_pause; then
                continue
            fi
            ui_pause "Appuie sur une touche pour continuer..."
        fi
    done
}
