# From MiniMax Reference

This adapter mirrors the role structure of the public MiniMax D Research expert:

```text
https://agent.minimax.io/experts?preview_expert_id=400918132543790
```

The MiniMax expert prompt and subagent configuration are intentionally not published in this repository.

## Mapping

| MiniMax reference role | OpenCode id |
| --- | --- |
| D Research Expert | `d-research` |
| Source Mapper | `d-research-source-mapper` |
| Recall Auditor | `d-research-recall-auditor` |
| Social Public Source Hunter | `d-research-social-public-source-hunter` |
| Evidence Verifier | `d-research-evidence-verifier` |
| Data Extractor | `d-research-data-extractor` |
| Report Synthesizer | `d-research-report-synthesizer` |

## Conversion Rules

- Main expert behavior becomes the body of `opencode/.opencode/agents/d-research.md`.
- Each MiniMax-style role becomes one hidden OpenCode subagent.
- MiniMax subagent attachment becomes OpenCode `permission.task` allowlisting.
- MiniMax skill dependency becomes OpenCode `permission.skill` allowlisting.
- MiniMax read-only/safety posture becomes `edit: deny` and `bash: ask`.
