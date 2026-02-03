---
name: planning-with-files
description: Implements Manus-style file-based planning for complex tasks. Creates task_plan.md, findings.md, and progress.md. Use when starting complex multi-step tasks, research projects, or any task requiring >5 tool calls.
license: MIT
---

# Planning with Files

Work like Manus: Use persistent markdown files as your "working memory on disk."

## Core Principle

```
Context Window = RAM (volatile, limited)
Filesystem = Disk (persistent, unlimited)

→ Anything important gets written to disk.
```

## Quick Start

Before ANY complex task, create these three files:

1. **task_plan.md** — Track phases and progress
2. **findings.md** — Store research and discoveries
3. **progress.md** — Session log and test results

See references/ for starting templates.

## File Purposes

| File | Purpose | When to Update |
|------|---------|----------------|
| `task_plan.md` | Phases, progress, decisions | After each phase |
| `findings.md` | Research, discoveries | After ANY discovery |
| `progress.md` | Session log, test results | Throughout session |

## Critical Rules

### 1. Create Plan First
Never start a complex task without `task_plan.md`. Non-negotiable.

### 2. The 2-Action Rule
> "After every 2 view/browser/search operations, IMMEDIATELY save key findings to text files."

This prevents visual/multimodal information from being lost.

### 3. Read Before Decide
Before major decisions, read the plan file. This keeps goals in your attention window.

### 4. Update After Act
After completing any phase:
- Mark phase status: `in_progress` → `complete`
- Log any errors encountered
- Note files created/modified

### 5. Log ALL Errors
Every error goes in the plan file. This builds knowledge and prevents repetition.

### 6. Never Repeat Failures
```
if action_failed:
    next_action != same_action
```
Track what you tried. Mutate the approach.

## The 3-Strike Error Protocol

```
ATTEMPT 1: Diagnose & Fix
  → Read error carefully
  → Identify root cause
  → Apply targeted fix

ATTEMPT 2: Alternative Approach
  → Same error? Try different method
  → Different tool? Different library?
  → NEVER repeat exact same failing action

ATTEMPT 3: Broader Rethink
  → Question assumptions
  → Search for solutions
  → Consider updating the plan

AFTER 3 FAILURES: Escalate to User
  → Explain what you tried
  → Share the specific error
  → Ask for guidance
```

## When to Use This Pattern

**Use for:**
- Multi-step tasks (3+ steps)
- Research tasks
- Building/creating projects
- Tasks spanning many tool calls

**Skip for:**
- Simple questions
- Single-file edits
- Quick lookups

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| State goals once and forget | Re-read plan before decisions |
| Hide errors and retry silently | Log errors to plan file |
| Stuff everything in context | Store large content in files |
| Start executing immediately | Create plan file FIRST |
| Repeat failed actions | Track attempts, mutate approach |

---

**This pattern is why Manus went from launch to $2B acquisition in 8 months.**

---

## Case Study: Tongxinyuan Dual-Site Deployment (2026-02)

### Context
The user required a complex deployment:
1. **Legacy Site**: Retain PHP system on Port 80/443.
2. **New Site**: Deploy Next.js system on Port 3000.
3. **Constraint**: Both accessible via SSL `tongxy.xyz` (Port 443) and `tongxy.xyz:3000`.

### Challenges Encountered
- **Nginx Config Loss**: `sed` command broke bind mounts; container saw old config while host had new config.
- **Port Conflict**: New App bound to 3000, preventing Nginx from binding 3000 for SSL.
- **Tool Failures**: Browser verification crashed multiple times; SSH commands failed due to connection drops.

### How `task.md` Saved the Session
The agent maintained a `task.md` throughout Phase 10 (Deployment).

1. **Crash Recovery**:
   - When the Browser Agent crashed verifying Port 80, the agent didn't restart from zero.
   - It read `task.md`, saw `[x] Configured Remote Server Alias`, and resumed at "Verify Port 80".

2. **State Tracking vs Memory**:
   - Agent "forgot" (context window limit) that Nginx was in Host Mode.
   - `task.md` recorded `[x] Updated Nginx Config on Host (Disabled Port 3000)`, preventing unnecessary research steps.

3. **Error Log**:
   - Recorded `Proxy Sort 400 Error` logic in `Decisions Made` section.
   - Recorded `TypeGen Auth 400` fix (Use root@debug.com).
   - This prevented trying the same failed auth strategy twice.

### Artifact Ecosystem
The synergy of three files proved critical:
1. **`task.md`**: The detailed checklist. kept the agent "honest" about what was *actually* done vs *planned*.
2. **`implementation_plan.md`**: The technical architecture. Defined *before* touching Nginx. When Nginx failed, we checked against the Plan.
3. **`walkthrough.md`**: The proof. Stored screenshots of "Pink Site" vs "Blue Site", allowing the user to trust the verification even when they couldn't access the internal ports.
