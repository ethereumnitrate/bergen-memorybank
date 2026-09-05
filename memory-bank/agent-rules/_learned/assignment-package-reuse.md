---
topics: ["api-design","reusable assignment packages"]
globs: ["packages/*/tests/public_tests.cpp"]
priority: low
auto_generated: true
derived_from: [cis277-assignment1-preflight]
evidence_count: 1
last_validated: 2026-09-05
---

# Assignment package reuse

- Keep changeable assignment metadata in one settings block and assignment-specific interface/behavior assertions in a replaceable harness.
- Verify a second synthetic assignment by changing only settings and harness; check labels, valid/invalid outcomes, and review notes while preserving the runner body and workflow.

## Evidence

The second-assignment maintainer scenario passed in the recorded 12-test Linux suite. See [reflection](../../reflection/cis277-assignment1-preflight-reflection.md) and [archive](../../archive/cis277-assignment1-preflight-archive.md).
