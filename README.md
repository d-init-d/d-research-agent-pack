# D Research Agent For OpenCode

OpenCode agent pack generated from the MiniMax **D Research** expert backup. It turns the MiniMax-style expert and subagent layout into project-local OpenCode agents.

This repo does **not** vendor the full `d-research` skill. It expects the `d-research` skill to be installed in OpenCode already.

## What This Provides

- A primary OpenCode agent: `d-research`
- Six hidden OpenCode subagents mapped from the MiniMax expert backup
- Strict `permission.task` allowlist so the main agent only sees the D Research workers
- `permission.skill` allowlist so the agents only load `d-research`
- Read-only-by-default research permissions
- Installation and adaptation notes

## Agent Map

| OpenCode agent id | Original role | Purpose |
| --- | --- | --- |
| `d-research` | D Research Expert | Main orchestrator and final synthesizer |
| `d-research-source-mapper` | Source Mapper | Maximizes audit-grade source recall with search matrices, source-basin coverage, archive/mirror hunting, candidate URLs, blockers, and next-query gaps. |
| `d-research-recall-auditor` | Recall Auditor | Runs an adversarial second-pass recall audit to find sources missed by Source Mapper using alternate queries, archives, mirrors, exact phrases, and same-name checks. |
| `d-research-social-public-source-hunter` | Social Public Source Hunter | Finds lawful public social/community sources across public posts, pages, profiles, videos, forums, and school/community channels with strict identity and privacy labeling. |
| `d-research-evidence-verifier` | Evidence Verifier | Verifies claims with exact URLs, primary sources, contradiction checks, staleness checks, confidence, and evidence-ledger rows. |
| `d-research-data-extractor` | Data Extractor | Extracts audit-grade structured data from public pages, files, APIs, tables, embedded JSON, and text; validates coverage and reports blockers. |
| `d-research-report-synthesizer` | Report Synthesizer | Synthesizes verified findings into source-backed reports with exact URLs, research trail, blockers, caveats, confidence, and gaps. |

## Install

1. Install the `d-research` skill into one OpenCode skill location, for example:

   ```powershell
   # Example target path; install/copy the actual d-research skill here.
   mkdir "$env:USERPROFILE\.config\opencode\skills\d-research" -Force
   ```

   OpenCode discovers skills from locations such as:

   - `.opencode/skills/<name>/SKILL.md`
   - `~/.config/opencode/skills/<name>/SKILL.md`
   - `.agents/skills/<name>/SKILL.md`
   - `~/.agents/skills/<name>/SKILL.md`

2. Copy this repo's agents into your project or global OpenCode config:

   Project-local:

   ```powershell
   Copy-Item -Recurse ".opencode\agents" "D:\path\to\your-project\.opencode\"
   ```

   Global:

   ```powershell
   mkdir "$env:USERPROFILE\.config\opencode\agents" -Force
   Copy-Item ".opencode\agents\*.md" "$env:USERPROFILE\.config\opencode\agents\" -Force
   ```

3. Restart OpenCode or open a new session, then select or mention:

   ```text
   @d-research
   ```

## How The Locking Works

- `hidden: true` keeps worker subagents out of normal autocomplete noise.
- `permission.task` on `d-research` denies every subagent first, then allows only the D Research workers.
- `permission.task` on each worker denies all nested delegation, so workers return findings instead of spawning more workers.
- `permission.skill` denies all skills first, then allows only `d-research`.
- `edit: deny` keeps the research workflow read-only by default.
- `bash: ask` allows parsing and deterministic extraction only after user approval.

This is close to a MiniMax expert/subagent setup, but OpenCode users can still edit local config files or directly invoke subagents if they know the agent id.

## Files

- `.opencode/agents/d-research.md`: primary orchestrator
- `.opencode/agents/d-research-*.md`: hidden workers
- `examples/opencode.json`: equivalent JSON-style config example
- `docs/install.md`: install notes
- `docs/permissions.md`: permission rationale
- `docs/from-minimax-backup.md`: mapping from the MiniMax expert backup
- `source/minimax-d-research-expert-config.json`: sanitized source backup snapshot

## Source And Attribution

- Agent prompts are derived from the user's MiniMax D Research expert backup.
- The workflow expects the `d-research` skill from `d-init-d/d-research-skill`.
- Preserve the original skill license and attribution when distributing the skill itself.

## OpenCode References

- Agents: https://dev.opencode.ai/docs/agents/
- Agent skills: https://dev.opencode.ai/docs/skills/
- Permissions: https://dev.opencode.ai/docs/permissions/
