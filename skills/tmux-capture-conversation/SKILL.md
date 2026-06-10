---
name: tmux-capture-conversation
description: "Capture tmux panes to cleaned Markdown transcripts."
argument-hint: [optional --tab N, title, destination]
---

# tmux Capture Conversation

## Canonical Paths

Before resolving ShipFlow-owned files, load `$SHIPFLOW_ROOT/skills/references/canonical-paths.md` (`$SHIPFLOW_ROOT` defaults to `$HOME/shipflow`) if present. Resolve this skill's script from `$SHIPFLOW_ROOT/skills/tmux-capture-conversation/scripts/`.

## Chantier Tracking

Trace category: `non-applicable`.
Process role: `helper`.

This skill captures a local terminal transcript and does not write to chantier specs. If invoked inside a spec-first flow, do not modify `Skill Run History`; report `Chantier: non applicable` only when useful.

## Core Rule

Default to the current tmux pane when the user does not provide a tab/window number. This matches `tmux capture-pane -p -S -` from inside the active conversation.

Ask for a tab/window number only when the user wants to capture a different tab and has not identified which one.

When a tab number is provided, interpret it as a 1-based ordinal in the tmux window list. In a zero-based tmux session, tab 2 resolves to window index `:1`, matching `tmux capture-pane -t :1 -p -S -`; in a one-based tmux session, tab 2 resolves to `:2`.

## Naming And Destination Rules

Do not accept the tmux window name as the final title when it is generic (`node`, `bash`, `zsh`, `claude`, `codex`, `nvim`, etc.) and transcript content gives a better subject. Infer a human title from the captured conversation first, for example `Conversation sf-build - architecture des skills`, not `Conversation tmux - panneau courant - node`.

### Presets

- `shipflow`: route inferred destination to `shipflow_data/workflow/conversations/` under governance root. Keep this output private to the chantier workflow (no publication).
- `docs`: keep the legacy default behavior under the project docs folder.

Use `--preset shipflow` or pass `shipflow` as the first positional preset.

The `shipflow` preset is a protected ShipFlow-owned evidence route. It must resolve to `${SHIPFLOW_ROOT:-$HOME/shipflow}/shipflow_data/workflow/conversations/`, not to the current project's governance root. If an explicit `--destination` for the `shipflow` preset points outside that directory, including a relative `shipflow_data/workflow/conversations/...` path from a product repo, the script must fail before writing. Use the `docs` preset for intentionally project-local conversation notes.

When no destination is supplied, prefer the project that the captured conversation is about, not the shell's incidental current directory. Use this priority:

1. User-supplied destination.
2. Project root inferred from absolute paths visible in the transcript, such as `/home/ubuntu/shipflow/skills/...`.
3. Git project root of the command working directory.
4. Current working directory only when no project root can be identified.

For `docs` or no preset:

- project-root destinations write under `<project-root>/docs/conversations/` by default.
- create that directory if needed.
- write directly under `$HOME` only when the transcript has no identifiable project and the command was actually run from `$HOME`.

For `shipflow` preset, resolve `${SHIPFLOW_ROOT:-$HOME/shipflow}` and write under `$SHIPFLOW_ROOT/shipflow_data/workflow/conversations/`.

`--destination` overrides preset inference only when it stays valid for that preset. For `shipflow`, explicit destinations outside `$SHIPFLOW_ROOT/shipflow_data/workflow/conversations/` are blocked.

The confirmation prompt must include the inferred title and full destination. If either looks generic or misplaced, fix it before asking the user to approve.

## Workflow

1. Extract the tab number from the request when present. If absent, plan to capture the current tmux pane.
2. Infer missing values:
   - title: use the user's requested title when present; otherwise infer a concise transcript title from captured conversation content, falling back to tmux window metadata only when the content has no usable subject.
   - destination: use the user's path when present; otherwise infer the project root from transcript paths or the command working directory and write to `docs/conversations/<title-slug>-YYYYMMDD-HHMMSS.md`.
3. Confirm before writing unless the user already explicitly approved the inferred destination in the current request.
   - Tell the user the chosen title and destination.
   - Ask whether it is OK.
   - Accept a replacement destination path as the answer and use that path instead.
4. Run the bundled script after confirmation.
5. Report the final Markdown path, mention the tmux target that was captured, and relay the printed Neovim command so the user can open the file from its parent directory.

## Script

Use `scripts/capture_tmux_conversation.sh` for the deterministic export.

Preview inferred values without writing:

```bash
SHIPFLOW_ROOT="${SHIPFLOW_ROOT:-$HOME/shipflow}"
"$SHIPFLOW_ROOT/skills/tmux-capture-conversation/scripts/capture_tmux_conversation.sh" --dry-run
```

Capture the current pane after confirmation:

```bash
SHIPFLOW_ROOT="${SHIPFLOW_ROOT:-$HOME/shipflow}"
"$SHIPFLOW_ROOT/skills/tmux-capture-conversation/scripts/capture_tmux_conversation.sh" --title "Conversation Codex" --destination ./conversation-codex.md --yes
```

Capture another tab after confirmation:

```bash
SHIPFLOW_ROOT="${SHIPFLOW_ROOT:-$HOME/shipflow}"
"$SHIPFLOW_ROOT/skills/tmux-capture-conversation/scripts/capture_tmux_conversation.sh" --tab 2 --title "Conversation Codex" --destination ./conversation-codex.md --yes
```

Arguments:

- `--tab N`: optional user-facing 1-based tab ordinal. Omit to capture the current pane.
- `--title TEXT`: optional Markdown title.
- `--destination PATH`: optional file path or directory. Directories receive an inferred filename. Paths without `.md` get `.md`.
- `--session NAME`: optional tmux session. Omit to use the current session, or the only available session when outside tmux.
- `--dry-run`: show the inferred capture plan without writing.
- `--yes`: skip the script's interactive confirmation. Use only after the user has approved the title and destination in chat or supplied them explicitly with clear approval.

If running interactively without `--yes`, the script asks for confirmation. Press Enter to accept, type a new destination to change it, or type `q`/`no` to abort.

After writing the file, the script prints:

```text
Open with Neovim: cd /path/to/output-dir && nvim output-file.md
```
