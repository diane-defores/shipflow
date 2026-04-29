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
    local items=("$@")

    local keys=()
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
            actions+=("$action")
            ((item_count++))
        fi
    done
    echo ""
    echo -e "${YELLOW}Your choice:${NC} \c"

    local choice
    if [ -r /dev/tty ]; then
        read -rsn1 choice < /dev/tty
        _bash_flush_stdin
    else
        read -r choice
    fi
    choice=$(_ui_normalize_choice "$choice")

    for ((j=0; j<${#keys[@]}; j++)); do
        local k
        k=$(echo "${keys[$j]}" | tr '[:upper:]' '[:lower:]')
        if [ "$choice" = "$k" ]; then
            local act="${actions[$j]}"
            [ "$act" = "__EXIT__" ] && return 1
            "$act"
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

        _bash_run_menu "${ADVANCED_MENU_ITEMS[@]}"
        local rc=$?
        [ $rc -eq 1 ] && break
        if [ $rc -eq 0 ]; then
            echo ""
            echo -e "${YELLOW}Appuie sur Entrée pour continuer...${NC}"
            read -r
        fi
    done
}

# Main menu loop — pure bash
run_menu() {
    while true; do
        clear
        print_header

        _bash_run_menu "${MAIN_MENU_ITEMS[@]}"
        local rc=$?
        if [ $rc -eq 0 ]; then
            echo ""
            echo -e "${YELLOW}Appuie sur Entrée pour continuer...${NC}"
            read -r
        fi
    done
}
