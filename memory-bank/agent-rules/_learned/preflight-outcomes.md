---
topics: ["error-handling","public preflight runners"]
globs: ["packages/*/validate.py"]
priority: low
auto_generated: true
derived_from: [cis277-assignment1-preflight]
evidence_count: 1
last_validated: 2026-09-05
---

# Preflight outcome handling

- Probe mandatory compiler/sanitizer capabilities independently before attributing student failures; unavailable checks cannot produce PASS.
- Report observed submission failures separately from unavailable stages. Preserve FAIL precedence when both occur, and verify diagnostics plus exit codes.

## Evidence

The harmless ASan probe and prerequisite/failure regressions are recorded in Phase 1 and Phase 2 verification. See [reflection](../../reflection/cis277-assignment1-preflight-reflection.md) and [archive](../../archive/cis277-assignment1-preflight-archive.md).
