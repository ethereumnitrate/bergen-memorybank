# Archive: CIS-277 Assignment 1 Student Preflight

## Metadata

- Task / feature: `cis277-assignment1-preflight`
- Complexity: Level 3
- Started / completed: 2026-09-05
- Status: COMPLETE on `codex/cis277-assignment1-preflight`, pending review and merge to `main`.
- Routing: `metadata_branch: main`, `pr_target: main`, `archive_strategy: push-and-pr`; one PR carries implementation and bookkeeping. Worktree retained for review.
- Version: `next`; task completion does not release the version.

## Summary and Requirements

Students receive exactly three files to check the posted Network Packet Buffer Pool assignment before submission. The Python standard-library runner checks required files and README structure, screens prohibited C++ tokens, compiles and runs the demo and independent public harness, and executes AddressSanitizer checks when supported. It reports PASS/0, FAIL/1, or INCOMPLETE/2; unavailable checks never earn a pass. All outcomes retain the public-check disclaimer and instructor-review notes.

The package is independent of the faculty kit. Instructor assignment facts live in one `ASSIGNMENT` dictionary, while class-specific interfaces and behavior live in a replaceable C++ harness. Synthetic second-assignment verification establishes reuse without changing the runner or workflow. Local checks preserve source files and require no network, student AI tools, or runtime dependencies beyond Python and compatible C++ tooling.

## Implementation and Decisions

| Phase | Result | Deliverables |
| --- | --- | --- |
| 1: Reusable runner and public tests | Complete, `ec72faa` | `packages/cis277-assignment1-preflight/validate.py`, `packages/cis277-assignment1-preflight/tests/public_tests.cpp`, maintainer-only `tests/preflight/test_validator.py` |
| 2: Workflow and student handoff | Complete, `97cad21` | `packages/cis277-assignment1-preflight/.github/workflows/validate.yml`; complete copy/run/fix/rerun evidence |

Compiler-backed signatures avoid imposing an unspecified Stack constructor. Public pool checks cover counts, byte capacity, exhaustion, LIFO reuse, safe invalid-pointer rejection, and binary isolation without requiring contiguous storage or an initial address order. A harmless sanitizer probe separates missing tooling from student failure. The thin, pinned-checkout Linux workflow invokes the same validator with read-only permissions and a five-minute job limit.

## Acceptance and Verification

All two implementation phases and 12 canonical acceptance criteria have evidence mapped in the [reflection](../reflection/cis277-assignment1-preflight-reflection.md). Hosted execution for AC-ASYNC-1 remains explicitly unverified; implementation and configuration are complete. Repository configuration sets `uat_required_for_archive: false`; no browser UAT gate applies to this CLI companion.

Recorded build verification, not rerun during documentation-only archive:

- `python3 -B -m unittest discover -s tests/preflight -p 'test_*.py'`: 12/12 tests passed with zero skips in Phase 2 on Ubuntu 24.04, Python 3.12.3, g++ 13.3.0. Includes normal and ASan execution, valid variants, intended interface/behavior/memory failures, malformed settings, missing prerequisites, timeouts, and reuse.
- Offline Linux handoff: help, PASS, deliberate README FAIL, restored PASS, and missing-compiler INCOMPLETE; original submission/package bytes preserved.
- Python compilation, 3.9 grammar parsing, tabnanny, workflow parsing, exact three-file inventory, and whitespace checks passed. Independent code/security/documentation review approved the build without actionable findings.

Archive verification checks status/phase/link consistency, learned-rule metadata and index, exact package inventory, unchanged package/test blobs relative to `1ff4a18`, and `git diff --check`. Runtime tests are not repeated because archive changes only Memory Bank documentation.

## Timeline

All recorded commits are dated 2026-09-05:

- `fc635e1`: initial plan and approved design.
- `6914f4f`: instructor settings and reuse clarification.
- `ec72faa`: Phase 1 implementation and tests.
- `97cad21`: Phase 2 workflow and verified handoff.
- `1ff4a18`: reflection of implementation and workflow.
- Archive and PR metadata commits follow in this branch's Git history; see the task header for the PR URL.

## Learning Consolidation

Four new low-priority rules, each with one task's evidence, were extracted and indexed:

- [Preflight outcome handling](../agent-rules/_learned/preflight-outcomes.md): distinguish missing mandatory capabilities from observed submission failure.
- [C++ lexical screening](../agent-rules/_learned/cpp-lexical-screening.md): retain valid-language regression cases around literal boundaries, including digit separators.
- [Assignment package reuse](../agent-rules/_learned/assignment-package-reuse.md): verify the settings/harness boundary with a different synthetic assignment.
- [Verification evidence](../agent-rules/_learned/cli-ci-verification-evidence.md): distinguish configuration inspection, actual execution, skipped checks, hosted runs, and source preservation.

Baseline learned-rule directories contained only `.gitkeep`. No rules were merged, retired, expired, pruned, or promoted. The index was constructed from the four rules using the installed `agent-rules-loading.md` contract; this plugin package contains no separate `rules-index` command reference.

Archive also labels historical planning snapshots and aligns the task journey's successful-message order with the design. Original plan, phase evidence, design, and reflection history remain available.

## Limitations and Follow-up

- Observe a hosted Actions run when copied into an authorized Actions-enabled assignment repository. The nested workflow in this development repository does not run as a root workflow.
- Python 3.9 runtime and Windows C++/ASan execution remain unverified; grammar checks and skipped cases do not establish those results.
- Public checks do not guarantee full credit, full memory safety, custom Stack use, complete demonstration coverage, analysis quality, or algorithmic complexity. The published allocation/deallocation O(1) wording ambiguity remains an instructor-review item.
- Review the PR before merging. No merge, student-repository publication, or Canvas submission is performed by archive.

## References

- [Task and phase evidence](../tasks/cis277-assignment1-preflight.md)
- [Approved design](../creative/cis277-assignment1-preflight-design.md)
- [Reflection](../reflection/cis277-assignment1-preflight-reflection.md)
- [Roadmap feature](../roadmap/cis277-assignment1-preflight.md)
- [Version next](../roadmap/versions/next.md)
