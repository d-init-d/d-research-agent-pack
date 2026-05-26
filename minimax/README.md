# MiniMax Agent Reference

This folder stores the MiniMax-side reference for the D Research expert used by this agent pack.

## Live Expert

Open the current MiniMax expert preview:

[`D Research` on MiniMax Agent](https://agent.minimax.io/experts?preview_expert_id=400918132543790)

## Configuration Privacy

The MiniMax expert prompt and subagent configuration are intentionally not published in this repository. This folder only keeps the public preview link.

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
