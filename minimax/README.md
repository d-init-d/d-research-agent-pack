# MiniMax Agent Reference

This folder stores the MiniMax-side reference for the D Research expert used by this agent pack.

## Live Expert

Open the current MiniMax expert preview:

[`D Research` on MiniMax Agent](https://agent.minimax.io/experts?preview_expert_id=400918132543790)

## Backup Snapshot

The backup snapshot used to generate the first OpenCode adapter is stored at:

[`backup/minimax-d-research-expert-config.json`](backup/minimax-d-research-expert-config.json)

The snapshot is included for auditability and reproducibility. It contains the expert prompt and subagent prompts, but it does not include secrets, API keys, or environment variables.

## Role Mapping

| MiniMax role | Adapter role |
| --- | --- |
| D Research Expert | Main orchestrator |
| Source Mapper | Source discovery and query fanout |
| Recall Auditor | Second-pass missed-source audit |
| Social Public Source Hunter | Public social/community source discovery |
| Evidence Verifier | Claim and identity verification |
| Data Extractor | Structured extraction from public sources |
| Report Synthesizer | Source-backed final report drafting |
