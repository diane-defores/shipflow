---
name: sf-resume
description: SF résume / SF resume — summarize the current conversation thread very quickly in 3 to 5 concise bullets, list task statuses, and say whether the user can safely close the conversation or what important context might be lost.
disable-model-invocation: false
argument-hint: [optional: court | ultra-court]
---

# SF Résume

## Goal

Give the user a fast closure snapshot of the current conversation only.

This skill is for users who feel lost across many chats and need to know:
- what was done in this thread
- what is still planned or in progress
- whether they can close the conversation
- what important context, idea, risk, or next step would be lost if they close it now

## Speed Rules

- Do not browse.
- Do not run commands.
- Do not inspect files.
- Do not spawn agents.
- Do not reconstruct every detail.
- Use only the visible conversation context.
- Prefer an approximate but useful answer over a slow exhaustive answer.

Target response time: immediate.

## Output Format

Always answer in French unless the user asks otherwise.

Keep the whole answer concise:
- 3 to 5 bullet points maximum for tasks
- one short closure status line
- one short "À ne pas oublier" line

Use this structure:

```markdown
**Résumé du thread**
- [Terminé|En cours|Planifié] Tâche courte accomplie ou prévue.
- [Terminé|En cours|Planifié] Tâche courte accomplie ou prévue.
- [Terminé|En cours|Planifié] Tâche courte accomplie ou prévue.

**Statut**: Tu peux fermer / Garde ouvert / À vérifier avant de fermer.

**À ne pas oublier**: point critique, idée business/projet/code, risque, décision ou prochaine action qui serait facile à perdre.
```

## Status Labels

Use only these labels in task bullets:
- `Terminé`: the task was actually completed in the conversation.
- `En cours`: work started but was not completed or not verified.
- `Planifié`: discussed or decided, but not started.

## Closure Verdict

Use:
- `Tu peux fermer` when all meaningful tasks are completed and no important unresolved action remains.
- `Garde ouvert` when work is actively incomplete, blocked, or depends on the current context.
- `À vérifier avant de fermer` when most work is done but there is a missing confirmation, test, commit, deployment, decision, or follow-up.

## What Counts as "À ne pas oublier"

Pick the single highest-value item from:
- an unverified implementation
- a file or command that still needs checking
- an unresolved product/business decision
- a next action the user explicitly cared about
- a discovered risk, bug, dependency, or deployment issue
- a useful idea that was mentioned but not captured elsewhere

If there is nothing meaningful, say:

```markdown
**À ne pas oublier**: Rien de critique identifié dans ce thread.
```

## Style

- Be direct.
- No long explanations.
- No generic recap.
- No more than 5 task bullets.
- If the thread has more than 5 tasks, merge related items and keep only the most important.
- If evidence is unclear, mark the item `À vérifier avant de fermer` in the status line rather than overstating completion.
