---
version: next
status: planned
priority: high
complexity: 3
linked_tasks: [cis277-assignment1-preflight]
created: 2026-09-05
---

# CIS-277 Assignment 1 Student Preflight

Provide three copyable files for students to check the posted Network Packet Buffer Pool assignment: a dependency-free Python validator, public C++ tests, and a GitHub Actions workflow running the same command. Report PASS, FAIL, or INCOMPLETE with plain explanations and the reminder that passing public checks does not guarantee full credit.

The instructor approved this scope and requested no bells and whistles. Deliver as an independent companion under `packages/cis277-assignment1-preflight/`. Exclude AI explanations, hidden grading, grades, dashboards, and changes to the Bergen faculty kit. Do not impose requirements absent from the assignment; record limited automated coverage and instructor-review items.

**Complexity rationale**: inferred by /ala:brainstorm. Level 3 due to bounded design choices for compiler-backed contracts, fair behavioral coverage, toolchain detection, and local/CI parity; not a system-wide change. Two compact implementation phases.
