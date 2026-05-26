# From MiniMax Backup

This pack was generated from the sanitized MiniMax D Research backup snapshot stored in this repo:

```text
source/minimax-d-research-expert-config.json
```

Generation input on the maintainer machine was the MiniMax expert backup folder created on 2026-05-24.

## Mapping

| MiniMax role | OpenCode id |
| --- | --- |
| D Research Expert | `d-research` |
| Source Mapper | `d-research-source-mapper` |
| Recall Auditor | `d-research-recall-auditor` |
| Social Public Source Hunter | `d-research-social-public-source-hunter` |
| Evidence Verifier | `d-research-evidence-verifier` |
| Data Extractor | `d-research-data-extractor` |
| Report Synthesizer | `d-research-report-synthesizer` |

## Conversion Rules

- Main expert instructions become the body of `.opencode/agents/d-research.md`.
- Each MiniMax subagent prompt becomes one hidden OpenCode subagent.
- MiniMax subagent attachment becomes OpenCode `permission.task` allowlisting.
- MiniMax skill dependency becomes OpenCode `permission.skill` allowlisting.
- MiniMax read-only/safety posture becomes `edit: deny` and `bash: ask`.
