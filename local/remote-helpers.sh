#!/bin/bash
# Shared SSH and remote PM2 helpers for ShipFlow local tunnel tools.

expand_identity_path() {
    local identity_file="$1"
    case "$identity_file" in
        "~") echo "$HOME" ;;
        "~/"*) echo "$HOME/${identity_file#~/}" ;;
        *) echo "$identity_file" ;;
    esac
}

normalize_identity_path() {
    local identity_file="$1"
    [ -z "$identity_file" ] && return 0

    local expanded
    expanded=$(expand_identity_path "$identity_file")

    case "$expanded" in
        /*)
            echo "$expanded"
            ;;
        *)
            local dir="${expanded%/*}"
            local base="${expanded##*/}"
            if [ "$dir" = "$expanded" ]; then
                dir="."
            fi

            local abs_dir
            if abs_dir=$(cd "$dir" 2>/dev/null && pwd -P); then
                echo "$abs_dir/$base"
            else
                echo "$(pwd -P)/$expanded"
            fi
            ;;
    esac
}

identity_path_candidates() {
    local identity_file="$1"
    [ -z "$identity_file" ] && return 0

    local expanded
    expanded=$(expand_identity_path "$identity_file")

    case "$expanded" in
        /*)
            printf '%s\n' "$expanded"
            ;;
        */*)
            normalize_identity_path "$expanded"
            ;;
        *)
            printf '%s\n' "$(pwd -P)/$expanded"
            [ -n "${HOME:-}" ] && printf '%s\n' "$HOME/.ssh/$expanded"
            [ -n "${HOME:-}" ] && printf '%s\n' "$HOME/$expanded"
            ;;
    esac
}

resolve_identity_path() {
    local identity_file="$1"
    [ -z "$identity_file" ] && return 0

    local candidate
    while IFS= read -r candidate; do
        [ -n "$candidate" ] || continue
        if [ -f "$candidate" ]; then
            normalize_identity_path "$candidate"
            return 0
        fi
    done < <(identity_path_candidates "$identity_file")

    return 1
}

validate_connection_target() {
    local target="$1"
    [[ -n "$target" ]] || return 1
    [[ "$target" != -* ]] || return 1
    [[ "$target" != *$'\n'* ]] || return 1
    [[ "$target" != *$'\r'* ]] || return 1
    [[ "$target" =~ ^[A-Za-z0-9._@-]+$ ]] || return 1
    [[ "$target" != *@*@* ]] || return 1

    local user=""
    local host="$target"
    if [[ "$target" == *"@"* ]]; then
        user="${target%%@*}"
        host="${target#*@}"
        validate_ssh_user "$user" || return 1
    fi

    validate_connection_host "$host"
}

validate_ssh_user() {
    local user="$1"
    [[ -n "$user" ]] || return 1
    [[ "$user" != -* ]] || return 1
    [[ "$user" =~ ^[A-Za-z0-9._-]+$ ]] || return 1
}

validate_connection_host() {
    local host="$1"
    [[ -n "$host" ]] || return 1
    [[ "$host" != -* ]] || return 1
    [[ "$host" != *$'\n'* ]] || return 1
    [[ "$host" != *$'\r'* ]] || return 1

    if [[ "$host" =~ ^[A-Za-z0-9._-]+$ ]] && is_exact_ssh_config_alias "$host"; then
        return 0
    fi

    [[ "$host" =~ ^[A-Za-z0-9.-]+$ ]] || return 1

    is_valid_ipv4 "$host" ||
        is_valid_dns_name "$host"
}

is_valid_ipv4() {
    local ip="$1"
    [[ "$ip" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]] || return 1

    local -a octets
    local octet
    IFS='.' read -r -a octets <<< "$ip"
    for octet in "${octets[@]}"; do
        [[ "$octet" =~ ^[0-9]+$ ]] || return 1
        [ "$((10#$octet))" -le 255 ] || return 1
    done
}

is_valid_dns_name() {
    local host="$1"
    [ "${#host}" -le 253 ] || return 1
    [[ "$host" == *.* ]] || return 1
    [[ "$host" != *..* ]] || return 1

    local -a labels
    local label tld
    IFS='.' read -r -a labels <<< "$host"
    for label in "${labels[@]}"; do
        [ -n "$label" ] || return 1
        [ "${#label}" -le 63 ] || return 1
        [[ "$label" =~ ^[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?$ ]] || return 1
    done

    tld="${labels[$((${#labels[@]} - 1))]}"
    [[ "$tld" =~ ^[A-Za-z][A-Za-z0-9-]*$ ]] || return 1
}

is_exact_ssh_config_alias() {
    local alias="$1"
    local ssh_config="${HOME:-}/.ssh/config"
    [ -f "$ssh_config" ] || return 1

    awk -v alias="$alias" '
        tolower($1) == "host" {
            for (i = 2; i <= NF; i++) {
                if ($i == alias) {
                    found = 1
                }
            }
        }
        END { exit found ? 0 : 1 }
    ' "$ssh_config"
}

validate_identity_file() {
    local identity_file="$1"
    [ -z "$identity_file" ] && return 0
    [[ "$identity_file" != -* ]] || return 1
    [[ "$identity_file" != *$'\n'* ]] || return 1
    [[ "$identity_file" != *$'\r'* ]] || return 1
    resolve_identity_path "$identity_file" >/dev/null
}

ssh_auth_mode() {
    local mode="${SSH_AUTH_METHOD:-key}"
    case "$mode" in
        password|key)
            printf '%s\n' "$mode"
            ;;
        *)
            printf '%s\n' "key"
            ;;
    esac
}

ssh_auth_args() {
    case "$(ssh_auth_mode)" in
        password)
            printf '%s\n' "-o" "BatchMode=no" "-o" "PreferredAuthentications=password,keyboard-interactive" "-o" "PubkeyAuthentication=no" "-o" "KbdInteractiveAuthentication=yes" "-o" "NumberOfPasswordPrompts=1"
            ;;
        *)
            printf '%s\n' "-o" "BatchMode=yes"
            ;;
    esac
}

ssh_control_path() {
    # OpenSSH appends a temporary suffix while creating the socket. Keep this
    # deliberately short for Termux and other systems with a 108-byte limit.
    local control_dir="${HOME:-.}/.s"
    mkdir -p "$control_dir" 2>/dev/null || true
    chmod 700 "$control_dir" 2>/dev/null || true
    printf '%s\n' "$control_dir/%C"
}

ssh_connection_reuse_args() {
    case "$(ssh_auth_mode)" in
        password)
            printf '%s\n' \
                "-o" "ControlMaster=auto" \
                "-o" "ControlPersist=8h" \
                "-o" "ControlPath=$(ssh_control_path)"
            ;;
    esac
}

ssh_base_args() {
    printf '%s\n' "-o" "ConnectTimeout=7" "-o" "StrictHostKeyChecking=accept-new"
}

validate_tcp_port() {
    local port="$1"
    [[ "$port" =~ ^[0-9]+$ ]] || return 1
    [ "$((10#$port))" -ge 1 ] && [ "$((10#$port))" -le 65535 ]
}

ssh_args() {
    while IFS= read -r arg; do
        [ -n "$arg" ] || continue
        printf '%s\n' "$arg"
    done < <(ssh_base_args)
    while IFS= read -r arg; do
        [ -n "$arg" ] || continue
        printf '%s\n' "$arg"
    done < <(ssh_auth_args)
    if [ -n "${SSH_IDENTITY_FILE:-}" ]; then
        if [ "$(ssh_auth_mode)" != "password" ]; then
            printf '%s\n' "-i" "$(resolve_identity_path "$SSH_IDENTITY_FILE" || normalize_identity_path "$SSH_IDENTITY_FILE")" "-o" "IdentitiesOnly=yes"
        fi
    fi
}

ssh_command_args() {
    while IFS= read -r arg; do
        [ -n "$arg" ] || continue
        printf '%s\n' "$arg"
    done < <(ssh_base_args)
    while IFS= read -r arg; do
        [ -n "$arg" ] || continue
        printf '%s\n' "$arg"
    done < <(ssh_connection_reuse_args)
    while IFS= read -r arg; do
        [ -n "$arg" ] || continue
        printf '%s\n' "$arg"
    done < <(ssh_auth_args)
    if [ -n "${SSH_IDENTITY_FILE:-}" ]; then
        if [ "$(ssh_auth_mode)" != "password" ]; then
            printf '%s\n' "-i" "$(resolve_identity_path "$SSH_IDENTITY_FILE" || normalize_identity_path "$SSH_IDENTITY_FILE")" "-o" "IdentitiesOnly=yes"
        fi
    fi
}

ssh_tunnel_args() {
    while IFS= read -r arg; do
        [ -n "$arg" ] || continue
        printf '%s\n' "$arg"
    done < <(ssh_base_args)

    case "$(ssh_auth_mode)" in
        password)
            while IFS= read -r arg; do
                [ -n "$arg" ] || continue
                printf '%s\n' "$arg"
            done < <(ssh_connection_reuse_args)
            printf '%s\n' "-o" "BatchMode=yes"
            ;;
        *)
            while IFS= read -r arg; do
                [ -n "$arg" ] || continue
                printf '%s\n' "$arg"
            done < <(ssh_auth_args)
            if [ -n "${SSH_IDENTITY_FILE:-}" ]; then
                printf '%s\n' "-i" "$(resolve_identity_path "$SSH_IDENTITY_FILE" || normalize_identity_path "$SSH_IDENTITY_FILE")" "-o" "IdentitiesOnly=yes"
            fi
            ;;
    esac
}

ensure_reusable_ssh_session() {
    [ "$(ssh_auth_mode)" = "password" ] || return 0
    [ -n "${REMOTE_HOST:-}" ] || return 1

    local args=()
    local check_output=""
    local open_output=""
    while IFS= read -r arg; do
        args+=("$arg")
    done < <(ssh_command_args)

    if check_output=$(ssh "${args[@]}" -O check "$REMOTE_HOST" 2>&1); then
        return 0
    fi

    echo -e "${BLUE}🔐 Ouverture de la session SSH réutilisable...${NC}" >&2
    if open_output=$(ssh "${args[@]}" -f -N "$REMOTE_HOST" 2>&1); then
        return 0
    fi

    if [ -n "$open_output" ]; then
        echo -e "${YELLOW}  Détail SSH: ${open_output//$'\n'/ }${NC}" >&2
    elif [ -n "$check_output" ]; then
        echo -e "${YELLOW}  Détail SSH: ${check_output//$'\n'/ }${NC}" >&2
    fi
    return 1
}

run_remote_ssh() {
    # Password-authenticated commands need a foreground master session first.
    # Background tunnels then attach to that session without handling a password.
    if ! ensure_reusable_ssh_session; then
        return 1
    fi

    local args=()
    while IFS= read -r arg; do
        args+=("$arg")
    done < <(ssh_command_args)
    ssh "${args[@]}" "$REMOTE_HOST" "$@"
}

shipflow_remote_pm2_ports_command() {
    local format="${1:-lines}"
    local formatter="cat"
    if [ "$format" = "comma" ]; then
        formatter="paste -sd, -"
    fi

    cat <<EOF
{
pm2 jlist 2>/dev/null | node -e '
const fs = require("fs");
try {
  const apps = JSON.parse(fs.readFileSync(0, "utf8"));
  const ports = [];
  for (const app of apps) {
    const pm2Env = app.pm2_env || {};
    if (pm2Env.status !== "online") continue;
    const env = pm2Env.env || {};
    const portValue = String(env.PORT || env.port || "");
    if (!/^[0-9]+$/.test(portValue)) continue;
    const port = Number(portValue);
    if (port < 1 || port > 65535) continue;
    const name = String(app.name || "unknown").replace(/[,:\\n\\r]/g, " ").trim() || "unknown";
    ports.push(String(port) + ":" + name);
  }
  if (ports.length) process.stdout.write(ports.join("\\n") + "\\n");
} catch {}
'
if command -v tmux >/dev/null 2>&1; then
  registry="\${SHIPFLOW_FLUTTER_WEB_SESSIONS_FILE:-\$HOME/.shipflow/flutter-web-sessions.tsv}"
  if [ -f "\$registry" ]; then
    while IFS='|' read -r name port project_dir session_name; do
      [ -n "\$name" ] || continue
      case "\$port" in ''|*[!0-9]*) continue ;; esac
      [ "\$port" -ge 1 ] && [ "\$port" -le 65535 ] || continue
      [ -n "\$session_name" ] || continue
      if tmux has-session -t "\$session_name" 2>/dev/null; then
        safe_name=\$(printf '%s' "\$name" | sed 's/[,:]/ /g')
        [ -n "\$safe_name" ] || safe_name="flutter-web"
        printf '%s:%s\n' "\$port" "\$safe_name"
      fi
    done < "\$registry"
  fi
fi
} | awk -F: '!seen[\$1]++' | $formatter
EOF
}
