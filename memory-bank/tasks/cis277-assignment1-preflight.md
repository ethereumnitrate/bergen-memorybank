---
slug: cis277-assignment1-preflight
feature: cis277-assignment1-preflight
status: PLANNING_COMPLETE
---

# cis277-assignment1-preflight: Simple student preflight for Assignment 1

**Complexity**: Level 3
**Status**: PLANNING_COMPLETE
**Roadmap**: cis277-assignment1-preflight
**Branch**: codex/cis277-assignment1-preflight
**Worktree**: ../ala-worktrees/bergen-memorybank/cis277-assignment1-preflight

## Task Description

Deliver a standalone three-file public preflight for the posted CIS-277 Assignment 1: Network Packet Buffer Pool. Students copy `validate.py`, `tests/public_tests.cpp`, and `.github/workflows/validate.yml` into their assignment repository, then run `python validate.py` (or `python3 validate.py` where appropriate), or inspect the GitHub Actions run. The instructor approved this design and explicitly requested simplicity; this planning record was finalized on 2026-09-05. This brainstorm ends at build-ready planning; implementation has not been authorized in this stage.

Keep the package independent of the existing no-code Bergen faculty kit. This is an approved C++ student tooling companion, so the existing faculty no-code constraint does not apply to these student files. Do not modify the Gem, Canvas integrations, course packagers, or core product context. Use synthetic code only in maintainer verification. Never add AI, telemetry, accounts, hidden grading, scores, dashboards, external services, or a plugin architecture.

Package source lives at `packages/cis277-assignment1-preflight/`; copy that directory's three files preserving their relative paths. Put brief usage and limitations in the opening comment/docstring of `validate.py`, also displayed by `python validate.py --help`; no fourth student guide is required. Use Python 3.9+ standard library and a C++17 GNU-compatible compiler (`g++` by default; optional `CXX` executable override). Linux CI is the full-check reference environment. Missing local toolchain/sanitizer support is INCOMPLETE, with GitHub Actions as the simple next step, never PASS.

### Published assignment contract

- Required root files: `Stack.h`, `MemoryPool.h`, `MemoryPool.cpp`, `main.cpp`, `README.md`. Additional supporting files are allowed, but the supplied compile path must work without IDE-specific configuration or linkage to `main.cpp` for library tests.
- `Stack<T>` publicly supplies `void push(const T&)`, `T pop()`, `T& top()`, `bool empty() const`, and `size_t size() const`. Students implement their own generic stack using an array, dynamic array, or linked structure; `std::stack` is prohibited. No Stack constructor signature, underflow behavior, or copying contract is specified.
- `MemoryPool(size_t blockSize, size_t blockCount)` and destructor; `void* allocate()`; `bool deallocate(void*)`; const `size_t availableBlocks()`, `allocatedBlocks()`, `blockSize()`, and `capacity()`. Capacity means bytes, not block count. Independent tests include headers and link `MemoryPool.cpp` without student `main.cpp`.
- Positive-size/count pools start fully available. Allocations return distinct usable blocks, decrement availability, increment allocated count, and return `nullptr` repeatedly when exhausted. Released blocks return to the free stack, so allocation reuses them in LIFO order. Do not require a particular initial address order or contiguous pool layout.
- Reject null, a valid live foreign address, an interior address, and a duplicate release without changing state. Test invalid pointers without inventing addresses, dereferencing them, or invoking undefined behavior in the harness.
- Binary payloads include zero and high-bit bytes and never exceed the block size. Check full-block readback and independence of simultaneously allocated blocks. Test cleanup, including destruction with blocks still allocated to the caller, under AddressSanitizer.
- Required README title: `# CIS-277 Assignment 1: Network Packet Buffer Pool`. Required second-level headings: `Student`, `Description`, `Stack Implementation`, `How to Compile`, `How to Run`, `Analysis Questions`. Require nonempty sections, but ignore fenced code when identifying headings. Do not prescribe an answer-numbering format or claim to validate identity or answer correctness.
- The demo must compile and run; its exact wording and formatting are unrestricted. Complete demonstration coverage, six substantive analysis answers, real custom Stack usage/behavior, code readability, and algorithmic complexity remain instructor-review items.
- Assignment behavior explicitly requires O(1) allocation; rubric text additionally mentions O(1) deallocation. Record the ambiguity without changing the published assignment or enforcing an unclarified complexity condition. No timing-based Big-O verdicts.

## Specification

**Feature Type**: End-User Feature
**Primary Persona**: CIS-277 student checking their own Assignment 1 before submission; an explicitly approved companion persona, separate from the faculty kit.
**Creative Exploration Needed**: No; the approved linked design resolves architecture, check boundaries, and student feedback.

### Invocation Method

- **Location**: Student assignment repository root, with the three files copied from `packages/cis277-assignment1-preflight/` preserving paths.
- **Element**: `python validate.py` (or `python3 validate.py`); `python validate.py --help` displays the brief instructions also present in the script's opening docstring.
- **Visibility**: Available after copying; GitHub Actions runs automatically on pushes and pull requests when enabled.
- **Navigation**: Copy files, run command, read results, fix code, rerun; alternatively open Actions > Assignment 1 Preflight > run > Validate.
- **Confidence**: HIGH: invocation and feedback are explicit in the instructor-approved companion design; no existing faculty interface changes.

### Success Criteria

- **User sees**: `PASS: All public preflight checks passed.` and `Passing all public checks does not guarantee full credit.` after every required check actually passes.
- **Verifiable at**: Terminal output or the relevant commit's GitHub Actions Validate step.
- **Data persisted**: None locally beyond student-owned files; the validator does not edit sources and cleans temporary builds. GitHub retains ordinary workflow logs.
- **Observable within**: One bounded run: 60 seconds per compilation, 10 seconds per execution/probe, and a 5-minute CI job limit.

### Acceptance Criteria

#### AC-ENTRY-1: Students can copy and invoke the complete package
**Priority**: MUST
**Given** a student has their assignment repository and Python 3.9+,
**When** they copy the supplied package and run `python validate.py --help`,
**Then** exactly `validate.py`, `tests/public_tests.cpp`, and `.github/workflows/validate.yml` are distributed; help explains `python validate.py`, the GNU-compatible C++17 compiler prerequisite (`g++` by default, optional `CXX` executable override), and the Actions route without requiring another guide, installer, or Python package.

#### AC-HAPPY-1: A successful run means every public check passed
**Priority**: MUST
**Given** a conforming submission and supported compiler/sanitizer tooling,
**When** the student runs `python validate.py`,
**Then** the real student code is compiled and exercised, all required stages report success, the command exits 0, and the terminal shows `PASS: All public preflight checks passed.` Every outcome summary includes `Passing all public checks does not guarantee full credit.` and identifies analysis answers, demonstration completeness, custom Stack implementation/use, and complexity as instructor-review items. The validator preserves student files and cleans its temporary builds.

#### AC-HAPPY-2: Required files and prohibited Stack tokens are screened
**Priority**: MUST
**Given** the files beside `validate.py` are the student's submission,
**When** the validator checks submission structure and C++ source,
**Then** it requires root `Stack.h`, `MemoryPool.h`, `MemoryPool.cpp`, `main.cpp`, and `README.md`, permits supporting files, and reports direct prohibited `std::stack` tokens with file/line in student C++ sources and local headers. Comments and string literals, the supplied harness, and generated output are excluded. Help identifies this as screening rather than proof of a custom Stack implementation or detection of every alias/macro evasion.

#### AC-HAPPY-3: README checks cover structure only
**Priority**: MUST
**Given** a submission includes `README.md`,
**When** its structure is checked,
**Then** the validator requires `# CIS-277 Assignment 1: Network Packet Buffer Pool` and nonempty second-level sections `Student`, `Description`, `Stack Implementation`, `How to Compile`, `How to Run`, and `Analysis Questions`; fenced-code headings do not satisfy these requirements. It does not grade identity, prose, analysis correctness, or answer numbering.

#### AC-HAPPY-4: Compiler checks honor the published interfaces
**Priority**: MUST
**Given** student headers and `MemoryPool.cpp`,
**When** C++17 compiler-backed contract checks and the demonstration build run,
**Then** the required callable signatures/return types and const accessors in the published contract above are checked, including `Stack<int>` and `Stack<void*>`, without constructing a Stack or requiring a default constructor. The demo builds with `-std=c++17 -Wall -Wextra -pedantic` without `-Werror` and runs without an exact-output requirement. Public tests build independently against `MemoryPool.cpp` without linking `main.cpp`; extra valid members and constructors are permitted.

#### AC-HAPPY-5: Public tests check the specified pool behavior
**Priority**: MUST
**Given** positive-size/count pools including a one-block pool and an odd byte block size,
**When** the independent public harness exercises construction, allocation, release, and reuse,
**Then** it verifies initial/current counts, byte capacity, distinct writable allocations, repeated `nullptr` exhaustion, LIFO reuse after release, and full-block binary readback/isolation including zero and high-bit bytes. Null, live foreign-object/other-pool, interior, and duplicate releases are rejected without changing counts or reusable blocks. The harness stays within valid byte bounds and never dereferences released/invalid pointers or invents numeric addresses; it imposes no initial address order or contiguous layout.

#### AC-HAPPY-6: Memory checks run on supported tooling
**Priority**: MUST
**Given** a harmless probe establishes that AddressSanitizer compilation and execution are supported,
**When** the demo and public harness are built and run normally and with ASan,
**Then** observed runtime memory errors fail the relevant check, and Linux CI also checks leaks, repeated pool lifetimes, and destruction while blocks remain allocated to the caller. Help states that exercised-path checks, including binary isolation, do not prove complete memory safety or detect every overwrite between pool blocks sharing an underlying allocation.

#### AC-ERROR-1: Students can locate failures and rerun
**Priority**: MUST
**Given** an assignment check fails or a student program exceeds its execution limit,
**When** the validator reports the run,
**Then** it exits 1 and labels the outcome FAIL, names the failed check, preserves relevant compiler/sanitizer diagnostics or expected/actual evidence, and tells the student to fix the issue and rerun `python validate.py`. A timeout identifies a likely hang or input prompt. Dependent checks are identified as unrun after compilation failure while independent file/README checks still run where possible; sources are not changed and temporary builds are cleaned.

#### AC-ERROR-2: Unavailable checks cannot become a pass
**Priority**: MUST
**Given** a required compiler, sanitizer capability, or other execution prerequisite is unavailable,
**When** the validator cannot complete a mandatory stage,
**Then** it reports the reason and unrun stages, points the student to GitHub Actions, and returns INCOMPLETE/exit 2 if no assignment failure was observed. If an assignment failure was also observed, it reports both conditions and returns FAIL/exit 1. A failed student sanitizer build after a successful support probe is a failed assignment check, not unsupported tooling.

#### AC-ASYNC-1: Actions exposes the same checks for each pushed revision
**Priority**: MUST
**Given** a student copies `.github/workflows/validate.yml` into an Actions-enabled assignment repository,
**When** a push or pull request starts Assignment 1 Preflight,
**Then** one bounded GitHub-hosted Linux job invokes `python3 validate.py` and exposes the same outcome and diagnostics at Actions > Assignment 1 Preflight > run > Validate for that revision. Both exits 1 and 2 fail the job. The workflow uses read-only contents permissions, pinned checkout without retained credentials, no secrets, no artifact uploads, and no duplicate correctness logic.

### Scope Boundaries

- **In scope**: The three-file public package, concise embedded help, deterministic assignment checks, and maintainer verification using synthetic valid and deliberately broken submissions outside the distributed package. Linux CI is the full-check reference.
- **Out of scope**: AI explanations, grades, hidden tests/grading agents, dashboards, reports, auto-fixes, network calls from the validator, submission automation, and changes to the faculty Gem/Canvas/course packagers. No tests impose zero-size/overflow construction behavior, Stack underflow, copying/moving, threading, arbitrary-object alignment, payload clearing, or other unspecified contracts. No automatic Big-O verdict; the O(1) allocation/deallocation wording discrepancy remains an instructor-review note.
- **Dependencies**: Python 3.9+ standard library, a GNU-compatible C++17 compiler and supported ASan runtime; GitHub Actions is the alternative when the local environment cannot complete checks.
- **NFR implications**: Plain text feedback, bounded subprocesses without shell interpolation, temporary cleanup, no telemetry/accounts/local storage, and no worked student solution in the package. Existing faculty-kit privacy and no-code boundaries remain separate.

### Creative Exploration Needed

Specification is concrete: proceed to implementation planning using `memory-bank/creative/cis277-assignment1-preflight-design.md`; no further design gate is open.

## User Journey Definition

**Feature Type**: End-User Feature
**Creative Phase Required**: Yes - bounded architecture and student feedback decisions; complete in the linked design.

### Invocation Method (End-User Features)

- **Location**: Student assignment repository root.
- **Element**: `python validate.py`; `python validate.py --help` explains prerequisites and copying the three files.
- **Navigation**: Copy the three supplied files, run the command, fix reported problems, and rerun. Alternatively push and open repository Actions > Assignment 1 Preflight > run > Validate step.
- **Visibility**: Command always available once copied; workflow runs on pushes and pull requests when Actions is enabled.

### Success Criteria (End-User Features)

- **User sees**: `PASS: All public preflight checks passed.` followed by `Passing all public checks does not guarantee full credit.`
- **User can verify at**: Terminal output or the GitHub Actions Validate step for the relevant commit.
- **Data persisted**: No student source edits or local report database; temporary build files cleaned up. GitHub retains its ordinary workflow logs.
- **Observable within**: One bounded run; proposed compile timeout 60 seconds per command, run/probe timeout 10 seconds, workflow timeout 5 minutes.

## Test Strategy

### Approach

- **Emphasis**: Integration checks of a small command-line package; synthetic valid and deliberately broken C++ fixtures verify that reported results are earned.
- **Target test count**: Approximately 8 public behavioral groups and 10 maintainer regression scenarios, combined where fixtures overlap. Do not multiply unit tests to mirror helper implementation.
- Public groups: construction/counts, distinct writable blocks, repeated exhaustion, LIFO reuse, invalid releases, duplicate releases, binary isolation, repeated pool lifetimes/destruction. Interface checks are compiler assertions, not source regexes.
- Maintainer scenarios: valid dynamic-array and linked Stack implementations (including a non-default-constructible Stack); missing root file; wrong MemoryPool signature; missing README section; comment/string versus real `std::stack` usage; wrong capacity; faulty exhaustion/reuse/release; out-of-bounds/leaking implementation under supported sanitizer; unavailable tools or sanitizer; timeout. Group related variants in table-driven tests rather than a large test framework.

### File Organization

- **New test files**: `packages/cis277-assignment1-preflight/tests/public_tests.cpp` is the distributed public test harness. `tests/preflight/test_validator.py` is a maintainer-only Python unittest suite using temporary directories and embedded synthetic fixture strings. Keep solution fixtures outside the student package.
- **Extend existing**: None. Existing faculty-kit release inventories and Node tests do not apply to this standalone companion.

### What NOT to Test

- No empty Stack pop/top, zero-sized pools, overflow-sized construction, copying/moving pools, alignment beyond byte storage, threading, payload zeroing, particular first block address, or contiguity: these are not specified.
- No mandatory default Stack constructor or guessed adapter configuration. Verify member signatures for multiple template types without constructing a Stack; review full Stack behavior separately.
- No exact demo text, automated explanation grading, identity verification, repository-name rejection based on checkout folder name, or live repository visibility/SHA lookup. GitHub submission requirements remain the published assignment's manual checklist.
- No proof of custom Stack use or memory-safety perfection from source scans or a sanitizer pass. No hidden suite, grading rubric engine, network calls, or automatic submission.

### Per-Phase Test Guidance

- Phase 1: Write focused regression cases first, then implement local checks and public tests. Demonstrate valid fixtures pass and known defects fail for the intended reason; missing prerequisites must be INCOMPLETE. Run `python -m unittest discover -s tests/preflight -p 'test_*.py'` from the companion worktree root.
- Phase 2: Exercise the same validator on Linux with sanitizer available, inspect workflow YAML and its exact command, and complete the three-file student copy/run/fix/rerun walkthrough. If hosted Actions cannot be exercised without publishing, record that as unverified rather than claiming a hosted pass.

## Implementation Roadmap

### New Source Files (pin path + extension)

- [ ] `packages/cis277-assignment1-preflight/validate.py` - usage, structure/source screening, compiler commands, temporary builds, bounded execution, summary and exit codes.
- [ ] `packages/cis277-assignment1-preflight/tests/public_tests.cpp` - independent contract assertions and public behavioral checks.
- [ ] `packages/cis277-assignment1-preflight/.github/workflows/validate.yml` - Linux push/pull-request job invoking `python3 validate.py`.
- [ ] `tests/preflight/test_validator.py` - maintainer regression cases and embedded synthetic fixture sources; not distributed to students.

### Phases

- [ ] Phase 1: Implement and verify the local three-file package's validator and C++ public tests. Keep the script procedural, dependency-free, and assignment-specific. Compile the demo using the published `-std=c++17 -Wall -Wextra -pedantic` flags without `-Werror`; build the independent harness separately. Run both normally and with ASan when supported. Probe sanitizer support with a harmless program so a student's sanitizer build failure is not mislabeled as unsupported tooling. Show concise check labels, expected/actual results where useful, original compiler/sanitizer diagnostics on failure, and a clear rerun instruction.
- [ ] Phase 2: Add the minimal GitHub Actions workflow and finish student handoff verification. Use a fixed supported Ubuntu runner, a pinned checkout action verified at build time, `contents: read`, no secrets or retained checkout credentials, no self-hosted runner, no artifact upload, and a 5-minute job timeout. Students receive exactly three files with the original five required submission files untouched. Verify documented CLI/CI behavior and record limitations.

## Creative Phases

- [x] Architecture: standalone Python runner plus C++ harness and thin Actions workflow.
- [x] Student journey: one command, plain diagnostic lines, PASS/FAIL/INCOMPLETE, no optional AI or reporting system.
- [x] Check boundaries: compiler-backed interfaces, limited lexical prohibition screening, behavior-only pool tests, explicit manual-review coverage.

See `memory-bank/creative/cis277-assignment1-preflight-design.md` for decisions and alternatives.

## Execution State

**Build Status**: IDLE
**Current Phase**: BUILD
**Last Completed**: Brainstorm, specification, taxonomy/concrete-spec checks, and independent plan critique
**Can Resume**: NO
**Current Step**: Planning complete; ready for Phase 1
**Plan Backend**: Codex native agent - usable; source default adapted by codex-adapter.md
**Brainstorm Critique**: Codex native agent - usable; approve, no substantive findings
**Taxonomy**: CLEAN - T-001 through T-008; 10 canonical acceptance criteria
**Concrete Spec**: PASS - exact invocation, result messages, observable locations, persistence, phase/test mapping

### Active Sub-Agents

(none)

### Completed Steps

- User approved public-checker-first design and simplicity constraint.
- Created isolated local worktree from verified origin/main; original checkout preserved.
- Collision check found no existing preflight feature/task.
- Glossary not built; no glossary-dependent naming gate applies.
- Spec Writer completed the Specification section; no unresolved design questions.
- Independent native Codex reviewer approved all four artifacts; no remediation required.
- Planning quality checks passed; no implementation or hosted workflow execution is claimed.

## Plan Critique

**Backend**: Codex native agent - usable. Repository config has no backend override; the installed codex-adapter.md routes source provider labels to available Codex-native agents. Native Spec Writer and independent critique dispatches completed successfully; no Claude companion or authentication probe was needed.

**Verdict**: approve

**Summary**: The three-file plan remains simple, honors the posted assignment, and distinguishes unavailable checks from successful checks. Synthetic valid/broken fixture verification is proportionate. Reviewed task, design, roadmap feature, and next-version linkage together.

**Findings**: None substantive or blocking. Applied: 0. Noted: 0.

**Next step**: Build Phase 1 from this worktree when requested. No further design approval is required for the approved scope.

## Planning Notes

**Complexity rationale**: inferred by /ala:brainstorm. Level 3 reflects bounded decisions about fair C++ checks, toolchain failures, and local/CI parity across three student files; there is no system-wide product change.

The approved task is planning only. No implementation, external publication, remote branch push, or PR is part of this handoff. Branch prefix uses `codex/` under desktop instructions; metadata and PR target remain `main`. Commit only the four planning artifacts after quality review.
