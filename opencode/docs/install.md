# Install Notes

## Prerequisite

Install the actual [`d-research-skill`](https://github.com/d-init-d/d-research-skill) separately. This adapter only contains OpenCode agent configuration and MiniMax-derived orchestration prompts.

OpenCode skill discovery locations include:

- `.opencode/skills/d-research/SKILL.md`
- `~/.config/opencode/skills/d-research/SKILL.md`
- `.agents/skills/d-research/SKILL.md`
- `~/.agents/skills/d-research/SKILL.md`

## Project-Local Install

From the root of this repository, copy the agents into your project:

```powershell
Copy-Item -Recurse "opencode\.opencode\agents" "D:\path\to\your-project\.opencode\"
```

Project-local install is best when you want this research stack to apply only to one repository.

## Global Install

```powershell
mkdir "$env:USERPROFILE\.config\opencode\agents" -Force
Copy-Item "opencode\.opencode\agents\*.md" "$env:USERPROFILE\.config\opencode\agents\" -Force
```

Global install is best when you want `@d-research` available everywhere.

## Optional Model Pinning

These agent files intentionally do not pin a model, so OpenCode can use your current configured provider/model. If you want a specific model, add a `model` field to the YAML frontmatter:

```yaml
model: openai/gpt-5.1-codex
```

Run `opencode models` to see available model IDs for your setup.
