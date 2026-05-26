# Claude Code Adapter

Status: planned.

This folder is reserved for a future Claude Code adapter built on top of [`d-research-skill`](https://github.com/d-init-d/d-research-skill).

The intended shape is:

- a main D Research agent/instruction profile
- scoped worker prompts mirroring the MiniMax subagent roles
- guidance for mapping Claude Code tools and permissions to the same read-only, source-backed workflow

Until this adapter is implemented, use the MiniMax reference in [`../minimax/`](../minimax/) or the ready OpenCode adapter in [`../opencode/`](../opencode/).
