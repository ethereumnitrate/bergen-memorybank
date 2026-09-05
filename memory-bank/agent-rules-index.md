# Agent Rules Index

**Last Updated**: 2026-09-05
**Active rules**: 4; all derived from one archived task and retained at low priority.

Load only rules matching the current files or topics. These rules apply to the standalone preflight companion and its evidence records; they do not expand the faculty-kit scope.

| Rule | Topics | Globs | Priority | Lines |
| --- | --- | --- | --- | --- |
| [Preflight outcome handling](agent-rules/_learned/preflight-outcomes.md) | error-handling; public preflight runners | `packages/*/validate.py` | low | 18 |
| [C++ lexical screening](agent-rules/_learned/cpp-lexical-screening.md) | testing-patterns; C++ lexical screening | `tests/preflight/*.py` | low | 18 |
| [Assignment package reuse](agent-rules/_learned/assignment-package-reuse.md) | api-design; reusable assignment packages | `packages/*/tests/public_tests.cpp` | low | 18 |
| [CLI and CI verification evidence](agent-rules/_learned/cli-ci-verification-evidence.md) | verification-evidence; CLI and CI handoffs | `memory-bank/tasks/*.md`, `memory-bank/reflection/*.md`, `memory-bank/archive/*.md` | low | 18 |

## Conflict Resolutions

None identified. The rules cover distinct outcome handling, lexical regression, reuse, and evidence concerns; none supersedes another.

## Validation

All four links and required frontmatter fields checked during archive. No retired or rejected rules. Combined rule content is under 300 lines. Index built from the current rule files under the installed agent-rules-loading contract.
