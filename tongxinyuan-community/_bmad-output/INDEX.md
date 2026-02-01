# Project Documentation & Memory Index

> **Last Synced**: 2026-02-01
> **Location**: `_bmad-output/`

This directory serves as the persistent "Long-Term Memory" for the Tongxinyuan Community Project. It contains plans, lessons learned, standards, and verification records.

## 1. Core Standards (Constitution)
- **[PROJECT_STANDARDS.md](../PROJECT_STANDARDS.md)** (Root)
    - *The Single Source of Truth (SSOT).*
    - Defines PocketBase v0.23+ operations.
    - Defines strict field naming conventions (Schema).

## 2. Planning & Strategy
- **[task_plan.md](./task_plan.md)**
    - The breakdown of all development phases (1-8).
    - Tracks current progress and next steps.
- **[implementation_plan_medical.md](./implementation_plan_medical.md)**
    - Specific technical design for Phase 7 (Medical Logs).
- **[findings.md](./findings.md)**
    - **CRITICAL**: Lessons learned repository.
    - Contains troubleshooting guides for "Uncontrolled Input", "PB Schema Mismatch", "CLI Locks", etc.
    - Consult this **before** debugging complex issues.

## 3. Verification & Evidence
- **[walkthrough_accommodation.md](./walkthrough_accommodation.md)**
    - Proof of work for Phase 6 (Accommodation History).
    - Includes screenshots and workflow references.

## 4. How to Initialize Agent
When a new agent (or context7) starts, it should:
1.  Read `PROJECT_STANDARDS.md` to understand the Rules of Engagement.
2.  Read `task_plan.md` to know the Current Objective.
3.  Read `findings.md` to avoid repeating past mistakes.
