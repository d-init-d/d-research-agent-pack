# D Research Agent Pack

Ready-to-use agent presets and subagent orchestration configs built on top of [`d-research-skill`](https://github.com/d-init-d/d-research-skill).

This repository is the **agent adapter layer** for D Research. It does not vendor the full skill. Install [`d-research-skill`](https://github.com/d-init-d/d-research-skill) separately, then choose the adapter for your agent platform.

## Purpose

`d-research-skill` provides the research workflow. This repo provides platform-specific agent wrappers that make the workflow easier to use consistently:

- fixed role prompts
- subagent routing
- source-recall checklists
- evidence verification gates
- read-only research defaults
- restorable config snapshots

The goal is to make a MiniMax-style D Research expert available across multiple agent runtimes.

## Adapter Status

| Platform | Status | Path | Notes |
| --- | --- | --- | --- |
| MiniMax Agent | Live reference | [`minimax/`](minimax/) | Public expert preview and source backup snapshot |
| OpenCode | Ready | [`opencode/`](opencode/) | Primary agent plus six hidden subagents |
| Claude Code | Planned | [`claude-code/`](claude-code/) | Placeholder for a future adapter |

## Live MiniMax Reference

The current MiniMax D Research expert is available here:

[`D Research` on MiniMax Agent](https://agent.minimax.io/experts?preview_expert_id=400918132543790)

The MiniMax configuration snapshot used to generate the first OpenCode adapter is stored at:

[`minimax/backup/minimax-d-research-expert-config.json`](minimax/backup/minimax-d-research-expert-config.json)

## Current OpenCode Pack

The OpenCode adapter provides:

- `d-research` primary agent
- `d-research-source-mapper`
- `d-research-recall-auditor`
- `d-research-social-public-source-hunter`
- `d-research-evidence-verifier`
- `d-research-data-extractor`
- `d-research-report-synthesizer`

See [`opencode/README.md`](opencode/README.md) for installation and behavior details.

## Repository Layout

```text
d-research-agent-pack/
  README.md
  minimax/
    README.md
    backup/
      minimax-d-research-expert-config.json
  opencode/
    README.md
    .opencode/
      agents/
    docs/
    examples/
  claude-code/
    README.md
  scripts/
    generate-opencode-from-minimax-backup.mjs
```

## Design Principles

- Keep [`d-research-skill`](https://github.com/d-init-d/d-research-skill) as the source of truth for the research workflow.
- Keep platform adapters thin, auditable, and easy to copy into a local config.
- Preserve read-only, lawful public-data boundaries.
- Prefer exact URLs, evidence ledgers, blocker reports, and confidence labels.
- Treat subagents as scoped workers; the main agent owns final synthesis.

## Attribution

- Skill dependency: [`d-init-d/d-research-skill`](https://github.com/d-init-d/d-research-skill)
- MiniMax expert reference: [`D Research`](https://agent.minimax.io/experts?preview_expert_id=400918132543790)
- OpenCode adapter prompts are derived from the D Research MiniMax expert backup stored in this repository.
