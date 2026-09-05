---
slug: cis277-assignment1-preflight
feature: cis277-assignment1-preflight
status: COMPLETE
---

# cis277-assignment1-preflight: Simple student preflight for Assignment 1

**Complexity**: Level 3
**Status**: COMPLETE
**Archived**: memory-bank/archive/cis277-assignment1-preflight-archive.md
**Completed**: 2026-09-05
**Latest Commit**: 1ff4a182673c221a6da4e5bba42adfe3809e7fda (verified reflection tip before archive; archive commits follow in Git history)
**Reflection**: memory-bank/reflection/cis277-assignment1-preflight-reflection.md
**Roadmap**: cis277-assignment1-preflight
**Branch**: codex/cis277-assignment1-preflight
**Worktree**: ../ala-worktrees/bergen-memorybank/cis277-assignment1-preflight

## Task Description

**Historical planning context**: The planning-only authorization below describes the original brainstorm. Later build, reflection, and archive invocations authorized the completed work recorded in Execution State.

Deliver a standalone three-file public preflight for the posted CIS-277 Assignment 1: Network Packet Buffer Pool. Students copy `validate.py`, `tests/public_tests.cpp`, and `.github/workflows/validate.yml` into their assignment repository, then run `python validate.py` (or `python3 validate.py` where appropriate), or inspect the GitHub Actions run. The instructor approved this design and explicitly requested simplicity; this planning record was finalized on 2026-09-05. This brainstorm ends at build-ready planning; implementation has not been authorized in this stage.

Keep the package independent of the existing no-code Bergen faculty kit. This is an approved C++ student tooling companion, so the existing faculty no-code constraint does not apply to these student files. Do not modify the Gem, Canvas integrations, course packagers, or core product context. Use synthetic code only in maintainer verification. Never add AI to the student runtime, telemetry, accounts, hidden grading, scores, dashboards, external services, or a plugin architecture. Instructor-side assistance preparing packages in this conversation is permitted; students need no Codex, AI subscription, or AI tools.

Package source lives at `packages/cis277-assignment1-preflight/`; copy that directory's three files preserving their relative paths. Put brief usage and limitations in the opening comment/docstring of `validate.py`, also displayed by `python validate.py --help`; no fourth student guide is required. Use Python 3.9+ standard library and a C++17 GNU-compatible compiler (`g++` by default; optional `CXX` executable override). Linux CI is the full-check reference environment. Missing local toolchain/sanitizer support is INCOMPLETE, with GitHub Actions as the simple next step, never PASS.

### Reuse and instructor preparation

The instructor pastes an assignment into this conversation. Codex extracts explicit requirements, flags ambiguity without inventing rules, updates settings and public tests, verifies them using synthetic valid and broken implementations, and returns the three-file package with brief copy/run instructions. This is an authoring workflow, not a runtime assignment parser, separate application, or automatic generator feature. Assignment 1 is the first delivered package. Future C++17 assignments use the same runner and workflow with new settings and a replacement C++ harness; other languages are outside this release.

Use one clearly labeled instructor-only `ASSIGNMENT` dictionary near the top of `validate.py`: `assignment_name`, `required_files`, `readme_title`, `readme_headings`, `forbidden_tokens`, `demo_sources`, `test_sources`, `compiler_flags`, and `manual_review_notes`. Source lists contain student source paths; the runner appends `tests/public_tests.cpp` only for the independent-test build. Separate demo and test source lists preserve independence from `main.cpp`. Forbidden entries are literal C++ token sequences, not arbitrary code or configurable regex logic. All assignment-specific labels, file/README requirements, bans, compiler arguments, and review notes come from this dictionary. No external JSON/YAML settings file, plugin registry, or student configuration step.

For Assignment 1, populate the title, five required files, README headings, `std::stack` ban, demo sources `[main.cpp, MemoryPool.cpp]`, test sources `[MemoryPool.cpp]`, and C++17 warning flags from the contract below. MemoryPool/Stack-specific compiler assertions and behavior checks belong in `tests/public_tests.cpp`, not the Python runner. Keep a generic workflow name `Assignment Preflight`; print the configured assignment name in validator output. A small settings sanity check halts invalid settings with an instructor-configuration message and INCOMPLETE/exit 2, without blaming student code or running misleading checks. No switches to skip mandatory stages.

Students copy the prepared package, install Python and a compatible C++ compiler if needed, and run the command. Local checks read the files beside the script, including unpushed edits, without a network request or GitHub credentials. Actions checks its checked-out revision. No repository-URL fetch service is included. Students need neither this conversation nor the instructor's development environment.

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
**Primary Persona**: CIS-277 student checking their own assignment before submission; an explicitly approved companion persona, separate from the faculty kit. The instructor prepares the package with Codex before distributing it; students need no AI tools or subscriptions.
**Creative Exploration Needed**: No; the approved linked design resolves architecture, check boundaries, and student feedback.

### Invocation Method

- **Location**: Student assignment repository root, with the three files copied from `packages/cis277-assignment1-preflight/` preserving paths.
- **Element**: `python validate.py` (or `python3 validate.py`); `python validate.py --help` displays the brief instructions also present in the script's opening docstring.
- **Visibility**: Available after copying; GitHub Actions runs automatically on pushes and pull requests when enabled.
- **Navigation**: The instructor pastes the assignment into this conversation for package preparation and verification. Students copy the prepared files, run the command, read results, fix their assignment code, and rerun; alternatively open Actions > Assignment Preflight > run > Validate. Students edit neither the settings nor the public harness.
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

#### AC-ENTRY-2: Instructor prepares and verifies the student handoff
**Priority**: MUST
**Given** the instructor supplies a future C++17 assignment in this conversation,
**When** Codex prepares its settings and public test harness and verifies them against synthetic valid and deliberately broken submissions,
**Then** the instructor receives the same three-file package for distribution with verification evidence and any remaining limitations. Students run `python validate.py` against their own work without Codex, AI subscriptions, configuration editing, or network access for local checks; the pasted assignment is authoring input, not input to a runtime parser or generator command.

#### AC-HAPPY-1: A successful run means every public check passed
**Priority**: MUST
**Given** a conforming submission and supported compiler/sanitizer tooling,
**When** the student runs `python validate.py`,
**Then** the real student code is compiled and exercised, all required stages report success, the command exits 0, and the terminal shows `PASS: All public preflight checks passed.` Every outcome summary includes `Passing all public checks does not guarantee full credit.` and the configured `manual_review_notes`; Assignment 1 notes cover analysis answers, demonstration completeness, custom Stack implementation/use, and complexity. The validator preserves student files and cleans its temporary builds.

#### AC-HAPPY-2: Required files and prohibited Stack tokens are screened
**Priority**: MUST
**Given** the files beside `validate.py` are the student's Assignment 1 submission and its supplied `ASSIGNMENT` settings are unchanged,
**When** the validator checks submission structure and C++ source,
**Then** configured checks require root `Stack.h`, `MemoryPool.h`, `MemoryPool.cpp`, `main.cpp`, and `README.md`, permit supporting files, and report direct prohibited `std::stack` tokens with file/line in student C++ sources and local headers. Comments and string literals, the supplied harness, and generated output are excluded. Configured notes identify this as screening rather than proof of a custom Stack implementation or detection of every alias/macro evasion.

#### AC-HAPPY-3: README checks cover structure only
**Priority**: MUST
**Given** an Assignment 1 submission includes `README.md`,
**When** its structure is checked,
**Then** the configured checks require `# CIS-277 Assignment 1: Network Packet Buffer Pool` and nonempty second-level sections `Student`, `Description`, `Stack Implementation`, `How to Compile`, `How to Run`, and `Analysis Questions`; fenced-code headings do not satisfy these requirements. It does not grade identity, prose, analysis correctness, or answer numbering.

#### AC-HAPPY-4: Compiler checks honor the published interfaces
**Priority**: MUST
**Given** student headers and `MemoryPool.cpp`,
**When** C++17 compiler-backed contract checks and the demonstration build run,
**Then** checks solely in `tests/public_tests.cpp` verify the required callable signatures/return types and const accessors in the published contract above, including `Stack<int>` and `Stack<void*>`, without constructing a Stack or requiring a default constructor. Assignment 1 settings build the demo with `-std=c++17 -Wall -Wextra -pedantic` without `-Werror` and run it without an exact-output requirement. Public tests build independently against `MemoryPool.cpp` without linking `main.cpp`; extra valid members and constructors are permitted.

#### AC-HAPPY-5: Public tests check the specified pool behavior
**Priority**: MUST
**Given** positive-size/count pools including a one-block pool and an odd byte block size,
**When** the independent public harness in `tests/public_tests.cpp`, which solely owns assignment-specific behavior checks, exercises construction, allocation, release, and reuse,
**Then** it verifies initial/current counts, byte capacity, distinct writable allocations, repeated `nullptr` exhaustion, LIFO reuse after release, and full-block binary readback/isolation including zero and high-bit bytes. Null, live foreign-object/other-pool, interior, and duplicate releases are rejected without changing counts or reusable blocks. The harness stays within valid byte bounds and never dereferences released/invalid pointers or invents numeric addresses; it imposes no initial address order or contiguous layout.

#### AC-HAPPY-6: Memory checks run on supported tooling
**Priority**: MUST
**Given** a harmless probe establishes that AddressSanitizer compilation and execution are supported,
**When** the demo and public harness are built and run normally and with ASan,
**Then** observed runtime memory errors fail the relevant check, and Linux CI also checks leaks; the Assignment 1 harness exercises repeated pool lifetimes and destruction while blocks remain allocated to the caller. Configured Assignment 1 notes state that exercised-path checks, including binary isolation, do not prove complete memory safety or detect every overwrite between pool blocks sharing an underlying allocation.

#### AC-HAPPY-7: Settings and a replacement harness adapt the package to another assignment
**Priority**: MUST
**Given** `validate.py` has one plainly labeled `ASSIGNMENT` dictionary at its top with `assignment_name`, `required_files`, `readme_title`, `readme_headings`, `forbidden_tokens`, `demo_sources`, `test_sources`, `compiler_flags`, and `manual_review_notes`,
**When** a maintainer verifies one synthetic second C++17 assignment by changing only that dictionary and replacing `tests/public_tests.cpp`,
**Then** the unchanged runner and workflow compile/check the new assignment with no stale MemoryPool-specific diagnostics. All changeable assignment facts and messages come from these settings or the replacement harness; `forbidden_tokens` contains literal C++ token sequences checked with the existing lexical screening, and `test_sources` lists student sources only while the runner appends `tests/public_tests.cpp`. No additional config file, plugin registry, runtime assignment parser, or generator interface is introduced.

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

Invalid `ASSIGNMENT` settings are checked before student validation and yield INCOMPLETE/exit 2 with a configuration diagnostic directing the student to the instructor for a corrected package; they are never classified as a student failure or PASS.

#### AC-ASYNC-1: Actions exposes the same checks for each pushed revision
**Priority**: MUST
**Given** a student copies `.github/workflows/validate.yml` into an Actions-enabled assignment repository,
**When** a push or pull request starts Assignment Preflight,
**Then** one bounded GitHub-hosted Linux job invokes `python3 validate.py` and exposes the same outcome and diagnostics at Actions > Assignment Preflight > run > Validate for that revision. The generic workflow name and logic require no assignment-specific edits. Both exits 1 and 2 fail the job. The workflow uses read-only contents permissions, pinned checkout without retained credentials, no secrets, no artifact uploads, and no duplicate correctness logic.

### Scope Boundaries

- **In scope**: The three-file public package, concise embedded help, one `ASSIGNMENT` settings dictionary, replaceable C++17 public harness, instructor preparation in this conversation, and maintainer verification using synthetic valid and deliberately broken submissions outside the distributed package. Verify reuse with one synthetic second assignment. Linux CI is the full-check reference.
- **Out of scope**: Student-facing AI explanations/tools, grades, hidden tests/grading agents, dashboards, reports, auto-fixes, network calls from the validator, submission automation, runtime assignment parsing, a generator app/command, other programming languages, and changes to the faculty Gem/Canvas/course packagers. No tests impose zero-size/overflow construction behavior, Stack underflow, copying/moving, threading, arbitrary-object alignment, payload clearing, or other unspecified contracts. No automatic Big-O verdict; the O(1) allocation/deallocation wording discrepancy remains an instructor-review note.
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
- **Navigation**: Copy the three supplied files, run the command, fix reported problems, and rerun. Alternatively push and open repository Actions > Assignment Preflight > run > Validate step.
- **Visibility**: Command always available once copied; workflow runs on pushes and pull requests when Actions is enabled.

### Success Criteria (End-User Features)

- **User sees**: The disclaimer `Passing all public checks does not guarantee full credit.` and configured review notes, with `PASS: All public preflight checks passed.` as the final line on success.
- **User can verify at**: Terminal output or the GitHub Actions Validate step for the relevant commit.
- **Data persisted**: No student source edits or local report database; temporary build files cleaned up. GitHub retains its ordinary workflow logs.
- **Observable within**: One bounded run; proposed compile timeout 60 seconds per command, run/probe timeout 10 seconds, workflow timeout 5 minutes.

## Test Strategy

### Approach

- **Emphasis**: Integration checks of a small command-line package; synthetic valid and deliberately broken C++ fixtures verify that reported results are earned.
- **Target test count**: Approximately 8 public behavioral groups and 12 maintainer regression scenarios, combined where fixtures overlap. Do not multiply unit tests to mirror helper implementation.
- Public groups: construction/counts, distinct writable blocks, repeated exhaustion, LIFO reuse, invalid releases, duplicate releases, binary isolation, repeated pool lifetimes/destruction. Interface checks are compiler assertions, not source regexes.
- Maintainer scenarios: valid dynamic-array and linked Stack implementations (including a non-default-constructible Stack); missing root file; wrong MemoryPool signature; missing README section; comment/string versus real `std::stack` usage; wrong capacity; faulty exhaustion/reuse/release; out-of-bounds/leaking implementation under supported sanitizer; unavailable tools or sanitizer; timeout. Group related variants in table-driven tests rather than a large test framework.
- Add two reuse scenarios in the same test file: a tiny synthetic second C++ assignment changes only ASSIGNMENT values and public_tests.cpp while keeping the Python runner body/workflow unchanged, verifying changed labels, requirements, bans, review notes, and pass/fail results without stale MemoryPool assumptions; malformed settings return INCOMPLETE with an instructor-configuration message. The second fixture is verification only, not another student deliverable.

### File Organization

- **New test files**: `packages/cis277-assignment1-preflight/tests/public_tests.cpp` is the distributed public test harness. `tests/preflight/test_validator.py` is a maintainer-only Python unittest suite using temporary directories and embedded synthetic fixture strings. Keep solution fixtures outside the student package.
- **Extend existing**: None. Existing faculty-kit release inventories and Node tests do not apply to this standalone companion.

### What NOT to Test

- No empty Stack pop/top, zero-sized pools, overflow-sized construction, copying/moving pools, alignment beyond byte storage, threading, payload zeroing, particular first block address, or contiguity: these are not specified.
- No mandatory default Stack constructor or guessed adapter configuration. Verify member signatures for multiple template types without constructing a Stack; review full Stack behavior separately.
- No exact demo text, automated explanation grading, identity verification, repository-name rejection based on checkout folder name, or live repository visibility/SHA lookup. GitHub submission requirements remain the published assignment's manual checklist.
- No proof of custom Stack use or memory-safety perfection from source scans or a sanitizer pass. No hidden suite, grading rubric engine, network calls, or automatic submission.

### Per-Phase Test Guidance

- Phase 1: Write focused regression cases first, then implement local checks and public tests. Demonstrate valid fixtures pass and known defects fail for the intended reason; missing prerequisites and malformed settings must be INCOMPLETE. Verify reuse with the synthetic second assignment. Run `python -m unittest discover -s tests/preflight -p 'test_*.py'` from the companion worktree root.
- Phase 2: Exercise the same validator on Linux with sanitizer available, inspect workflow YAML and its exact command, and complete the three-file student copy/run/fix/rerun walkthrough. If hosted Actions cannot be exercised without publishing, record that as unverified rather than claiming a hosted pass.

## Implementation Roadmap

### New Source Files (pin path + extension)

- [x] `packages/cis277-assignment1-preflight/validate.py` - instructor ASSIGNMENT settings, reusable runner, usage, structure/source screening, compiler commands, temporary builds, bounded execution, summary and exit codes.
- [x] `packages/cis277-assignment1-preflight/tests/public_tests.cpp` - independent contract assertions and public behavioral checks.
- [x] `packages/cis277-assignment1-preflight/.github/workflows/validate.yml` - Linux push/pull-request job invoking `python3 validate.py`.
- [x] `tests/preflight/test_validator.py` - maintainer regression cases and embedded synthetic fixture sources; not distributed to students.

### Phases

- [x] Phase 1: Implement and verify the reusable Python runner with the single ASSIGNMENT dictionary, plus Assignment 1's C++ public tests. Keep the script procedural and dependency-free. Read source lists, compiler flags, requirements, restrictions, and review notes from settings; keep class-specific assertions in C++. Compile the demo using the published `-std=c++17 -Wall -Wextra -pedantic` flags without `-Werror`; build the independent harness separately. Run both normally and with ASan when supported. Probe sanitizer support with a harmless program so a student's sanitizer build failure is not mislabeled as unsupported tooling. Show concise labels, expected/actual results where useful, original compiler/sanitizer diagnostics on failure, and a rerun instruction. Verify reuse and malformed-settings behavior in the maintainer suite.
- [x] Phase 2: Add the generic Assignment Preflight workflow and finish student handoff verification. Use a fixed supported Ubuntu runner, a pinned checkout action verified at build time, `contents: read`, no secrets or retained checkout credentials, no self-hosted runner, no artifact upload, and a 5-minute job timeout. Students receive exactly three prepared files with the original five required submission files untouched. Provide brief copy/run instructions in the handoff response and embedded help; students do not edit settings or need Codex. Verify documented CLI/CI behavior and record limitations. Keep the workflow unchanged for the synthetic second assignment.

## Creative Phases

- [x] Architecture: standalone Python runner plus C++ harness and thin Actions workflow.
- [x] Student journey: one command, plain diagnostic lines, PASS/FAIL/INCOMPLETE, no optional AI or reporting system.
- [x] Check boundaries: compiler-backed interfaces, limited lexical prohibition screening, behavior-only pool tests, explicit manual-review coverage.
- [x] Reuse: instructor settings plus a replaceable C++ harness; preparation from pasted assignments, standalone execution for students.

See `memory-bank/creative/cis277-assignment1-preflight-design.md` for decisions and alternatives.

## Execution State

**Build Status**: IDLE
**Current Phase**: COMPLETE
**Last Completed**: Task archive and consolidation of four evidence-backed lessons (2026-09-05)
**Can Resume**: NO
**Current Step**: Archive complete; submit the existing branch for review to main
**Plan Backend**: Codex native agent - usable; source default adapted by codex-adapter.md
**Brainstorm Critique**: Codex native agent - usable; reuse clarification approved, no substantive findings
**Taxonomy**: CLEAN - T-001 through T-008; 12 canonical acceptance criteria
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
- User clarified standalone local usage, settings-based reuse for future assignments, and instructor preparation from pasted assignment text; requested spec update before build.
- Spec Writer updated the contract and independent reviewer approved the reuse clarification. Taxonomy and diff checks passed; two build phases remain pending.
- User invoked `/ala:build cis277-assignment1-preflight` on 2026-09-05, authorizing Phase 1 implementation and the build workflow's phase commit/push. Earlier planning-only restrictions describe the prior handoff.
- Reused the clean `codex/cis277-assignment1-preflight` worktree; fetched origin and confirmed `origin/main` was already an ancestor. Original checkout and unrelated user files were preserved.
- TDD: 12 regression tests failed before implementation; all 12 then passed on Linux. A C++ digit-separator screening regression was separately observed failing and fixed before final review.
- Independent verification passed the complete companion suite plus final scanner regression, Python compilation/syntax checks, and whitespace checks. Independent code/security review approved the final files; documentation review required no changes.
- User invoked `/ala:build cis277-assignment1-preflight` again on 2026-09-05, authorizing Phase 2 and its phase commit/push. The clean task worktree matched its remote; after fetching, `origin/main` remained an ancestor, so no rebase was needed.
- Added the thin generic workflow; verified the official checkout release pin and supported runner, parsed the YAML, and confirmed the exact three-file inventory.
- Independent Linux verification passed all 12 companion tests without skips. Independent code/security/documentation review approved the workflow and embedded student instructions without findings.
- Offline Linux copy/run/fix/rerun verification passed with byte-for-byte preservation of student files. Both implementation phases are complete; reflection and archive remain separate commands.
- User invoked `/ala:reflect cis277-assignment1-preflight` on 2026-09-05. Fetched origin, verified the clean task worktree and matching remote tip at `97cad21`, and confirmed `origin/main` remains an ancestor; no rebase was needed.
- Reflection Agent completed the Level 3 implementation/design and ALA/Codex workflow assessment. Parent review checked the 12-criterion evidence mapping, four extractable lessons, three-file inventory, and retained verification limits. Output: `memory-bank/reflection/cis277-assignment1-preflight-reflection.md`.
- Reflection uses the recorded passing Linux suite and offline handoff evidence; runtime tests were not rerun for documentation-only changes. Hosted Actions, Python 3.9 runtime, and Windows C++/ASan remain unverified. Lessons remain in the reflection pending archive.

### Phase 1 Verification Evidence

**Date**: 2026-09-05
**Result**: PHASE_COMPLETE (1 of 2); overall task remains IN_PROGRESS.
**Source/test mapping**: `tests/preflight/test_validator.py` exercises both `validate.py` and `tests/public_tests.cpp` through temporary synthetic submissions. One companion test batch; no shared faculty-kit implementation changed.

- **RED**: 12 failures before the validator/harness existed.
- **Initial GREEN**: 12/12 tests on Ubuntu 24.04, Python 3.12.3, GNU g++ 13.3.0; 27.298 seconds. Tests include valid dynamic-array/linked Stack fixtures, interfaces, pool defects, real ASan overflow/leak failures, README/source checks, unavailable prerequisites, execution timeout, malformed settings, and settings/harness reuse for a second assignment.
- **Additional RED to GREEN**: A valid C++ digit separator (`1'000`) could hide a later prohibited token. The added scanner variant failed before numeric tokenization was fixed, then passed (one focused test).
- **Independent Linux verification**: `python3 -B -m unittest discover -s tests/preflight -p 'test_*.py'` in an ephemeral Ubuntu container: 12 tests passed, no skips, 28.393 seconds. The final scanner test additionally passed after the isolated tokenization edit (1 test, 0.076 seconds).
- **Independent Windows verification**: `python -B -m unittest discover -s tests/preflight -p 'test_*.py'`: successful run of 12 tests in 0.724 seconds, with 10 compiler-dependent subcases explicitly skipped because Windows has no GNU-compatible compiler on PATH. Final scanner test passed separately (0.051 seconds). These skips are not evidence of Windows C++ or sanitizer support.
- **Build/syntax**: Both Python files compiled using Python's `compile` without bytecode artifacts; `ast.parse(..., feature_version=(3, 9))` passed. Python 3.9 runtime execution itself was not exercised. The Linux suite built and ran real C++17 demo and independent harness fixtures normally and with ASan.
- **Lint**: `python -B -m tabnanny` for both Python files, focused trailing-whitespace checks for all three new files, and `git diff --check` passed. No separate Python linter/type checker is configured. The unrelated faculty-kit Node release inventory/tests do not apply to this companion, per this task's Test Strategy.
- **Review**: Independent native Codex code review APPROVED; no blocking findings. Code security and dependency review passed; Python standard library and C++ standard library only, no added third-party runtime packages, upgrades, telemetry, AI, or network clients.
- **Documentation**: Embedded help and configured review notes cover prerequisites, run/fix/rerun, local checks, cleanup, exit codes, and limits. Core `techContext.md`, `systemPatterns.md`, and faculty-kit artifacts remain unchanged as required by the approved scope.
- **Technical reference**: Reviewed [AddressSanitizer documentation](https://clang.llvm.org/docs/AddressSanitizer.html) on 2026-09-05 for compile/link instrumentation, fatal diagnostics, and platform-dependent leak support. Linux sanitizer execution and deliberate defects were verified locally, not inferred from documentation.

**Phase 1 handoff (historical)**: The workflow and complete three-file verification remained for Phase 2. These are now complete as recorded below; Phase 1 itself did not claim hosted execution or a complete package.

### Phase 2 Verification Evidence

**Date**: 2026-09-05
**Result**: BUILD_COMPLETE (2 of 2).
**Changed files**: `packages/cis277-assignment1-preflight/.github/workflows/validate.yml` and this task record. The Python runner, public C++ harness, maintainer suite, and faculty-kit artifacts are unchanged.
**Test-first exception**: This phase is configuration/documentation only and adds no production executable logic. No new tests mirroring the 20-line workflow were added. Parsed configuration checks, independent review, the complete existing integration suite, and actual CLI handoff checks supply proportionate evidence.

- **Workflow**: Generic `Assignment Preflight`, `push` and `pull_request`, one `ubuntu-24.04` job with `timeout-minutes: 5`, top-level `contents: read`, checkout with `persist-credentials: false`, and one `Validate` step invoking exactly `python3 validate.py`. No secrets, uploads, privileged triggers, extra validation logic, or self-hosted runner.
- **Pin verification**: `git ls-remote --tags https://github.com/actions/checkout.git 'refs/tags/v6*'` resolved v6.1.0 to `d23441a48e516b6c34aea4fa41551a30e30af803`. Confirmed the [official release](https://github.com/actions/checkout/releases/tag/v6.1.0) and [action metadata at that SHA](https://raw.githubusercontent.com/actions/checkout/d23441a48e516b6c34aea4fa41551a30e30af803/action.yml), including the credential input and Node 24 runtime. Confirmed Ubuntu 24.04 in the [GitHub-hosted runner reference](https://docs.github.com/en/actions/reference/runners/github-hosted-runners). References checked on 2026-09-05.
- **Configuration/inventory**: Parsed workflow using maintainer-installed PyYAML BaseLoader (not a package dependency); verified event names, permissions, runner, timeout, checkout pin/input, two steps, exact command, and no trailing whitespace. Recursive inventory contains exactly `validate.py`, `tests/public_tests.cpp`, and `.github/workflows/validate.yml`.
- **Independent full Linux suite**: `python3 -B -m unittest discover -s tests/preflight -p 'test_*.py'`: 12/12 tests passed, zero skips, 32.169 seconds. Ephemeral Ubuntu 24.04 container, Python 3.12.3, GNU g++ 13.3.0, read-only worktree mount, bytecode disabled. Real C++17 normal and ASan builds/runs passed; synthetic interface/behavior defects, overflow/leaks, unavailable prerequisites, malformed settings, and timeouts were checked. The replacement-assignment scenario uses the same copied workflow with only its settings/harness replaced; pass/fail behavior remains correct.
- **Build/lint**: Independent `compile()` and `ast.parse(..., feature_version=(3, 9))` passed for both Python files; `python3 -B -m tabnanny` passed. Workflow whitespace check and `git diff --check` passed. No separate Python linter/type checker is configured; unrelated faculty-kit tests are outside this companion scope.
- **Student handoff**: Created a temporary synthetic assignment with its original five files, then copied the package and checked that exactly three files were added and all original bytes were preserved. In Ubuntu 24.04 with the container network disconnected, `python3 validate.py --help` passed; `python3 validate.py` passed all normal/ASan checks (exit 0); removing the Analysis Questions heading produced the named README failure and rerun instruction (exit 1); restoring it returned PASS (exit 0). A nonexistent `CXX` executable returned INCOMPLETE (exit 2). Every invocation preserved all source/package bytes; temporary submission and the task-owned containers were cleaned up.
- **Review**: Independent native Codex code/security/documentation review APPROVED, no actionable findings. Embedded help covers the complete copy/run/fix/rerun and Actions routes; no extra student guide or settings edit is needed. No third-party runtime dependencies or upgrades were added; checkout is pinned to the verified official release.
- **Limitations**: Hosted GitHub Actions was not executed. YAML inspection and equivalent local Linux execution do not establish a hosted CI pass. The workflow activates when copied into an Actions-enabled student repository; it stays nested in this development repository. Python 3.9 grammar passed, but Python 3.9 runtime itself was not exercised. Windows C++/ASan support is not claimed. Public checks retain the configured instructor-review and no-full-credit limits.

**Student handoff**: Copy the three files from `packages/cis277-assignment1-preflight/` into the assignment repository, preserving `tests/` and `.github/workflows/`. Keep the existing submission files. Run `python validate.py` (or `python3 validate.py`), fix reported issues, and rerun; alternatively push and open Actions > Assignment Preflight > run > Validate. Students do not edit settings or need Codex.

### Reflection Completion

**Date**: 2026-09-05
**Result**: REFLECTION_COMPLETE; implementation quality Good, ALA/Codex workflow effectiveness Good.
**Validation**: Reflection/task status and link consistency, all completed phase markers, 12 acceptance-criterion entries, exactly four extractable lessons, exact three-file package inventory, and `git diff --check` passed. Changes are limited to this task and its reflection; implementation and faculty-kit artifacts are unchanged.
**Git record**: The reflection commit carries both documents on `codex/cis277-assignment1-preflight`; resolve its SHA with `git log -1 -- memory-bank/reflection/cis277-assignment1-preflight-reflection.md` rather than embedding a self-referential commit hash.

**Reflection handoff (historical)**: `/ala:archive cis277-assignment1-preflight`, subsequently invoked on 2026-09-05.

### Archive Completion

**Date**: 2026-09-05
**Result**: COMPLETE; both phases and reflection preserved, linked feature completed, four new low-priority learned rules indexed. No existing rules were merged, retired, expired, pruned, or promoted.
**Authorization**: User invoked `/ala:archive cis277-assignment1-preflight`; configured strategy is push-and-pr to protected `main`. All archive records ride the existing task branch because metadata and PR targets both equal `main`. The worktree and branch remain available for review.
**Evidence**: Clean task worktree and no stashes at entry; fetched remote matched `1ff4a18`, with `origin/main` already an ancestor. Build results remain historical: 12/12 Linux tests with zero skips and offline handoff passed; hosted Actions, Python 3.9 runtime, and Windows C++/ASan remain unverified.
**Documentation cleanup**: Labeled planning snapshots as historical and aligned journey message order with the approved design and runner. Student files and maintainer tests are unchanged by archive.
**Archive validation**: Inline Python consistency check passed: two completed phases, four learned rules with required metadata and accurate index line counts, 24 resolvable Markdown links, exactly three unchanged student files, and unchanged maintainer tests. `git diff --check` passed; no runtime tests were rerun for these documentation-only edits.
**Next likely**: Review the archive PR to `main`.

## Plan Critique

**Backend**: Codex native agent - usable. Repository config has no backend override; the installed codex-adapter.md routes source provider labels to available Codex-native agents. Native Spec Writer and independent critique dispatches completed successfully; no Claude companion or authentication probe was needed.

**Verdict**: approve

**Summary**: The three-file plan remains simple, honors the posted assignment, and distinguishes unavailable checks from successful checks. Synthetic valid/broken fixture verification is proportionate. The initial review covered task, design, roadmap feature, and next-version linkage. A focused follow-up review approved the settings-based reuse clarification: assignment facts stay in one dictionary, behavior tests in the replaceable C++ harness, and the generic workflow stays unchanged. Instructor preparation is separate from student execution; the second-assignment fixture and malformed-settings check add proportionate verification.

**Findings**: None substantive or blocking. Applied: 0. Noted: 0.

**Planning next step (historical)**: Build Phase 1 from this worktree when requested. Both build phases have since completed; see Execution State for the current next action.

## Planning Notes (historical)

**Complexity rationale**: inferred by /ala:brainstorm. Level 3 reflects bounded decisions about fair C++ checks, toolchain failures, and local/CI parity across three student files; there is no system-wide product change.

The approved task is planning only. No implementation, external publication, remote branch push, or PR is part of this handoff. Branch prefix uses `codex/` under desktop instructions; metadata and PR target remain `main`. Commit only the four planning artifacts after quality review.
