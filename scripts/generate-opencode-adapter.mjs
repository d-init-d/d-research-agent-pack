import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");

const DEFAULT_OUT = path.join(repoRoot, "opencode");

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  }),
);

if (!args.source) {
  throw new Error(
    "Missing --source=<path-to-private-minimax-reference-config.json>. MiniMax prompt and subagent configuration are intentionally not stored in this repo.",
  );
}

const sourcePath = path.resolve(args.source);
const outDir = path.resolve(args.out || DEFAULT_OUT);

const raw = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
if (raw.expert?.name !== "D Research") {
  throw new Error(`Expected D Research config, got: ${raw.expert?.name || "unknown"}`);
}

const minimaxPreviewUrl = "https://agent.minimax.io/experts?preview_expert_id=400918132543790";
const skillUrl = "https://github.com/d-init-d/d-research-skill";

const roleIds = new Map([
  ["Source Mapper", "d-research-source-mapper"],
  ["Recall Auditor", "d-research-recall-auditor"],
  ["Social Public Source Hunter", "d-research-social-public-source-hunter"],
  ["Evidence Verifier", "d-research-evidence-verifier"],
  ["Data Extractor", "d-research-data-extractor"],
  ["Report Synthesizer", "d-research-report-synthesizer"],
]);

const orderedSubagents = raw.subagents.map((subagent) => {
  const id = roleIds.get(subagent.name);
  if (!id) throw new Error(`No OpenCode id mapping for subagent: ${subagent.name}`);
  return { ...subagent, id };
});

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });
const write = (file, content) => {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${content.trimEnd()}\n`, "utf8");
};

const yamlBlock = (lines) => `---\n${lines.join("\n")}\n---`;

function escapeYaml(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ");
}

const mainFrontmatter = yamlBlock([
  'description: "Audit-grade web research orchestrator using the installed d-research skill and fixed OpenCode subagents."',
  "mode: primary",
  "temperature: 0.1",
  "permission:",
  "  read: allow",
  "  list: allow",
  "  glob: allow",
  "  grep: allow",
  "  webfetch: allow",
  "  websearch: allow",
  "  skill:",
  '    "*": deny',
  "    d-research: allow",
  "  task:",
  '    "*": deny',
  ...orderedSubagents.map((subagent) => `    ${subagent.id}: allow`),
  "  edit: deny",
  "  bash: ask",
  "  external_directory: ask",
  "color: primary",
]);

const workerFrontmatter = (subagent) =>
  yamlBlock([
    `description: "${escapeYaml(subagent.description)}"`,
    "mode: subagent",
    "hidden: true",
    "temperature: 0.1",
    "permission:",
    "  read: allow",
    "  list: allow",
    "  glob: allow",
    "  grep: allow",
    "  webfetch: allow",
    "  websearch: allow",
    "  skill:",
    '    "*": deny',
    "    d-research: allow",
    "  task:",
    '    "*": deny',
    "  edit: deny",
    "  bash: ask",
    "  external_directory: ask",
    "color: secondary",
  ]);

function mainAgentMarkdown() {
  const subagentList = orderedSubagents
    .map((subagent) => `- \`${subagent.id}\`: ${subagent.name}`)
    .join("\n");

  return `${mainFrontmatter}

# D Research OpenCode Agent

You are the OpenCode adapter for the MiniMax **D Research** expert reference.

## OpenCode Adapter Contract

- Load and follow the installed \`d-research\` skill before every non-trivial research task.
- Use the Task tool only with the fixed subagents listed below.
- Do not use generic or unrelated subagents when this agent has a specialized worker for the job.
- Keep research read-only unless the user explicitly asks for a write action.
- If the Task tool or a required subagent is unavailable, state the limitation and manually apply the same checklist before final synthesis.
- The main agent owns final synthesis, contradiction checks, confidence, and caveats.

## Fixed OpenCode Subagent Map

${subagentList}

## Restore Source

- Private source config date: ${raw.backupDate || "not recorded"}
- MiniMax expert preview: ${minimaxPreviewUrl}
- Private MiniMax config source: not published in this repository

## Original D Research Expert Instructions

${raw.expert.instructions}`;
}

function subagentMarkdown(subagent) {
  return `${workerFrontmatter(subagent)}

# ${subagent.name}

You are the OpenCode subagent \`${subagent.id}\` for the D Research agent.

## OpenCode Adapter Contract

- Load and follow the installed \`d-research\` skill when available.
- Work only within this role's scope.
- Return exact URLs, access state, blockers, confidence, unresolved gaps, and next queries when relevant.
- Do not write the final answer unless explicitly asked by the main D Research agent.
- Do not spawn additional subagents. Return gaps and recommendations to the main agent instead.

## Original MiniMax Subagent Prompt

${subagent.systemPrompt}`;
}

function opencodeReadme() {
  const subagentRows = orderedSubagents
    .map((subagent) => `| \`${subagent.id}\` | ${subagent.name} | ${subagent.description} |`)
    .join("\n");

  return `# D Research Adapter For OpenCode

OpenCode agent adapter derived from the MiniMax **D Research** expert structure. It turns the MiniMax-style expert and subagent layout into project-local or global OpenCode agents.

This adapter does **not** vendor the full [\`d-research-skill\`](${skillUrl}). It expects [\`d-research-skill\`](${skillUrl}) to be installed in OpenCode already.

## What This Provides

- A primary OpenCode agent: \`d-research\`
- Six hidden OpenCode subagents mapped from the D Research expert roles
- Strict \`permission.task\` allowlist so the main agent only sees the D Research workers
- \`permission.skill\` allowlist so the agents only load \`d-research\`
- Read-only-by-default research permissions
- Installation and adaptation notes

## Agent Map

| OpenCode agent id | Original role | Purpose |
| --- | --- | --- |
| \`d-research\` | D Research Expert | Main orchestrator and final synthesizer |
${subagentRows}

## Install

1. Install [\`d-research-skill\`](${skillUrl}) into one OpenCode skill location, for example:

   \`\`\`powershell
   # Example target path; install/copy the actual d-research skill from:
   # ${skillUrl}
   mkdir "$env:USERPROFILE\\.config\\opencode\\skills\\d-research" -Force
   \`\`\`

   OpenCode discovers skills from locations such as:

   - \`.opencode/skills/<name>/SKILL.md\`
   - \`~/.config/opencode/skills/<name>/SKILL.md\`
   - \`.agents/skills/<name>/SKILL.md\`
   - \`~/.agents/skills/<name>/SKILL.md\`

2. Copy this adapter's agents into your project or global OpenCode config.

   Project-local:

   \`\`\`powershell
   Copy-Item -Recurse "opencode\\.opencode\\agents" "D:\\path\\to\\your-project\\.opencode\\"
   \`\`\`

   Global:

   \`\`\`powershell
   mkdir "$env:USERPROFILE\\.config\\opencode\\agents" -Force
   Copy-Item "opencode\\.opencode\\agents\\*.md" "$env:USERPROFILE\\.config\\opencode\\agents\\" -Force
   \`\`\`

3. Restart OpenCode or open a new session, then select or mention:

   \`\`\`text
   @d-research
   \`\`\`

## How The Locking Works

- \`hidden: true\` keeps worker subagents out of normal autocomplete noise.
- \`permission.task\` on \`d-research\` denies every subagent first, then allows only the D Research workers.
- \`permission.task\` on each worker denies all nested delegation, so workers return findings instead of spawning more workers.
- \`permission.skill\` denies all skills first, then allows only \`d-research\`.
- \`edit: deny\` keeps the research workflow read-only by default.
- \`bash: ask\` allows parsing and deterministic extraction only after user approval.

This is close to a MiniMax expert/subagent setup, but OpenCode users can still edit local config files or directly invoke subagents if they know the agent id.

## Files

- \`.opencode/agents/d-research.md\`: primary orchestrator
- \`.opencode/agents/d-research-*.md\`: hidden workers
- \`examples/opencode.json\`: equivalent JSON-style config example
- \`docs/install.md\`: install notes
- \`docs/permissions.md\`: permission rationale
- \`docs/from-minimax-reference.md\`: mapping from the MiniMax reference roles

## Source And Attribution

- Agent prompts are derived from a private D Research MiniMax reference config. The MiniMax prompt and subagent configuration are intentionally not published here.
- The workflow expects [\`d-research-skill\`](${skillUrl}) from [\`d-init-d/d-research-skill\`](${skillUrl}).
- MiniMax reference expert: [\`D Research\`](${minimaxPreviewUrl})
- Preserve the original skill license and attribution when distributing the skill itself.

## OpenCode References

- Agents: https://dev.opencode.ai/docs/agents/
- Agent skills: https://dev.opencode.ai/docs/skills/
- Permissions: https://dev.opencode.ai/docs/permissions/
`;
}

function installDoc() {
  return `# Install Notes

## Prerequisite

Install the actual [\`d-research-skill\`](${skillUrl}) separately. This adapter only contains OpenCode agent configuration and MiniMax-derived orchestration prompts.

OpenCode skill discovery locations include:

- \`.opencode/skills/d-research/SKILL.md\`
- \`~/.config/opencode/skills/d-research/SKILL.md\`
- \`.agents/skills/d-research/SKILL.md\`
- \`~/.agents/skills/d-research/SKILL.md\`

## Project-Local Install

From the root of this repository, copy the agents into your project:

\`\`\`powershell
Copy-Item -Recurse "opencode\\.opencode\\agents" "D:\\path\\to\\your-project\\.opencode\\"
\`\`\`

Project-local install is best when you want this research stack to apply only to one repository.

## Global Install

\`\`\`powershell
mkdir "$env:USERPROFILE\\.config\\opencode\\agents" -Force
Copy-Item "opencode\\.opencode\\agents\\*.md" "$env:USERPROFILE\\.config\\opencode\\agents\\" -Force
\`\`\`

Global install is best when you want \`@d-research\` available everywhere.

## Optional Model Pinning

These agent files intentionally do not pin a model, so OpenCode can use your current configured provider/model. If you want a specific model, add a \`model\` field to the YAML frontmatter:

\`\`\`yaml
model: openai/gpt-5.1-codex
\`\`\`

Run \`opencode models\` to see available model IDs for your setup.
`;
}

function permissionsDoc() {
  return `# Permission Design

The goal is to mimic the MiniMax D Research expert as closely as OpenCode allows.

## Main Agent

\`d-research\` is a primary agent. It can:

- read/search local files for attached/source material
- use web search and web fetch
- load only the \`d-research\` skill
- delegate only to the fixed D Research subagents

It cannot:

- edit files by default
- call unrelated subagents
- silently run shell commands; \`bash\` is set to \`ask\`

## Worker Subagents

Each worker has:

- \`mode: subagent\`
- \`hidden: true\`
- \`task: "*": deny\`
- \`edit: deny\`
- \`skill: d-research\` only

Workers are intended to return scoped findings to the main agent, not to become independent orchestrators.

## Why Not Fully Sealed?

OpenCode config is local and editable by the user. \`permission.task\` controls what the model sees through the Task tool, but it is not a cryptographic lock. This pack is a strong routing policy, not a sealed hosted expert.
`;
}

function minimaxDoc() {
  return `# From MiniMax Reference

This adapter mirrors the role structure of the public MiniMax D Research expert:

\`\`\`text
${minimaxPreviewUrl}
\`\`\`

The MiniMax expert prompt and subagent configuration are intentionally not published in this repository.

## Mapping

| MiniMax reference role | OpenCode id |
| --- | --- |
| D Research Expert | \`d-research\` |
${orderedSubagents.map((subagent) => `| ${subagent.name} | \`${subagent.id}\` |`).join("\n")}

## Conversion Rules

- Main expert behavior becomes the body of \`opencode/.opencode/agents/d-research.md\`.
- Each MiniMax-style role becomes one hidden OpenCode subagent.
- MiniMax subagent attachment becomes OpenCode \`permission.task\` allowlisting.
- MiniMax skill dependency becomes OpenCode \`permission.skill\` allowlisting.
- MiniMax read-only/safety posture becomes \`edit: deny\` and \`bash: ask\`.
`;
}

function exampleConfig() {
  const taskConfig = Object.fromEntries([
    ["*", "deny"],
    ...orderedSubagents.map((subagent) => [subagent.id, "allow"]),
  ]);

  const agents = {
    "d-research": {
      description:
        "Audit-grade web research orchestrator using the installed d-research skill and fixed OpenCode subagents.",
      mode: "primary",
      temperature: 0.1,
      permission: {
        read: "allow",
        list: "allow",
        glob: "allow",
        grep: "allow",
        webfetch: "allow",
        websearch: "allow",
        skill: {
          "*": "deny",
          "d-research": "allow",
        },
        task: taskConfig,
        edit: "deny",
        bash: "ask",
        external_directory: "ask",
      },
    },
  };

  for (const subagent of orderedSubagents) {
    agents[subagent.id] = {
      description: subagent.description,
      mode: "subagent",
      hidden: true,
      temperature: 0.1,
      permission: {
        read: "allow",
        list: "allow",
        glob: "allow",
        grep: "allow",
        webfetch: "allow",
        websearch: "allow",
        skill: {
          "*": "deny",
          "d-research": "allow",
        },
        task: {
          "*": "deny",
        },
        edit: "deny",
        bash: "ask",
        external_directory: "ask",
      },
    };
  }

  return JSON.stringify(
    {
      $schema: "https://opencode.ai/config.json",
      agent: agents,
    },
    null,
    2,
  );
}

write(path.join(outDir, ".opencode/agents/d-research.md"), mainAgentMarkdown());
for (const subagent of orderedSubagents) {
  write(path.join(outDir, `.opencode/agents/${subagent.id}.md`), subagentMarkdown(subagent));
}

write(path.join(outDir, "README.md"), opencodeReadme());
write(path.join(outDir, "docs/install.md"), installDoc());
write(path.join(outDir, "docs/permissions.md"), permissionsDoc());
write(path.join(outDir, "docs/from-minimax-reference.md"), minimaxDoc());
write(path.join(outDir, "examples/opencode.json"), exampleConfig());

console.log(
  JSON.stringify(
    {
      outDir,
      sourcePath,
      agents: ["d-research", ...orderedSubagents.map((subagent) => subagent.id)],
    },
    null,
    2,
  ),
);
