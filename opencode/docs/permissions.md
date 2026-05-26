# Permission Design

The goal is to mimic the MiniMax D Research expert as closely as OpenCode allows.

## Main Agent

`d-research` is a primary agent. It can:

- read/search local files for attached/source material
- use web search and web fetch
- load only the `d-research` skill
- delegate only to the fixed D Research subagents

It cannot:

- edit files by default
- call unrelated subagents
- silently run shell commands; `bash` is set to `ask`

## Worker Subagents

Each worker has:

- `mode: subagent`
- `hidden: true`
- `task: "*": deny`
- `edit: deny`
- `skill: d-research` only

Workers are intended to return scoped findings to the main agent, not to become independent orchestrators.

## Why Not Fully Sealed?

OpenCode config is local and editable by the user. `permission.task` controls what the model sees through the Task tool, but it is not a cryptographic lock. This pack is a strong routing policy, not a sealed hosted expert.
