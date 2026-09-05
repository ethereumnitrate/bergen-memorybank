# CIS-277 Assignment 1 Preflight Design

**Date**: 2026-09-05
**Status**: Approved; build-ready
**Task**: cis277-assignment1-preflight

## Approved Intent

Help students check their existing assignment before submitting. The instructor approved a public checker first and requested that it stay simple. Deliver exactly three student files; no AI, scoring, hidden grader, installer, extra Python packages, or web application. This design is a standalone student companion rather than an expansion of the no-code faculty Gem.

## Alternatives Considered

| Approach | Tradeoff | Decision |
| --- | --- | --- |
| Public deterministic checker | Small setup, repeatable results, clear limited coverage | Selected |
| Checker with AI explanations | More configuration and privacy concerns for little preflight value | Excluded |
| Complete private grading system | Separate trust boundary, rubric decisions, and submission execution infrastructure | Separate future work; not included |

## Architecture and Student Journey

`student repository -> python validate.py -> compile + public tests -> PASS / FAIL / INCOMPLETE`

GitHub Actions invokes the same command on a Linux runner. The workflow is a thin wrapper, with no duplicate correctness logic. The student copies `validate.py`, `tests/public_tests.cpp`, and `.github/workflows/validate.yml` preserving paths. Instructions live in the Python file's opening docstring and `--help`. Results appear directly in the terminal or Actions > Assignment 1 Preflight > run > Validate; no report file or separate interface.

The script locates the assignment beside itself, uses a temporary build directory, preserves student files, and passes compiler arguments without a shell. Use g++ by default and an optional CXX executable override; do not add a compiler-discovery framework. Python 3.9+ standard library only. GNU-compatible local compilers are supported where present; Linux Actions is the full-check reference. Compiler/probe timeouts distinguish a failed student check from missing infrastructure; absent prerequisites cannot earn a pass. A timed-out student test is a failure with a likely hang/input prompt explanation.

Run the normal demo and independent tests, then sanitizer builds/runs when a harmless probe establishes support. Warn that ASan checks only exercised paths and may not detect one logical pool block overwriting its neighbor within the same underlying allocation. Binary isolation tests add useful coverage without promising complete memory-safety proof.

## Fairness and Check Boundaries

| Area | Automated evidence | Limit |
| --- | --- | --- |
| Files and README | Exact root filenames, required Markdown headings, nonempty sections | No name/identity checks or answer grading; don't impose numbering |
| Interfaces | C++ compiler checks callable required signatures and return types, const accessors | Avoid brittle header regexes; allow additional members and constructors |
| Stack | Signature checks instantiated for int and void pointers; screen C++ tokens for std::stack after ignoring comments/string literals | Do not assume default construction; custom implementation and actual use require review; screening is not a full C++ parser |
| Pool | Initial counts/capacity, unique writable blocks, repeated exhaustion, LIFO release/reuse, invalid/duplicate rejection, binary isolation | No prescribed internal representation or initial allocation order |
| Demo | Published C++17 build and bounded execution | No exact output match; required demonstration content needs review |
| Memory | Normal and ASan execution, destruction with outstanding blocks | No safety guarantee for unexecuted paths or uninstrumented pool suballocation boundaries |
| Complexity | Explicit instructor-review note | No timing-based O(1) claim; published deallocation wording is inconsistent |

Use positive dimensions, including a one-block pool and a small odd byte size. Keep full-block writes within bounds. Invalid-pointer tests use null, a live local object, a live other-pool allocation, and an interior pointer of an allocated multi-byte block. Never manufacture arbitrary numeric pointers or dereference released/invalid pointers. Deallocation rejection must leave counts and reusable blocks unchanged.

The required README headings and interfaces are recorded in the task so a future build does not depend on a transient attachment. The input was the instructor's pasted Assignment 1, not a retrieved or inferred rubric. Do not add zero-size behavior, underflow rules, copy/move semantics, contiguity, alignment for arbitrary C++ objects, or a new required constructor. Do not enforce O(1) deallocation until the instructor clarifies the assignment; complexity review is outside preflight regardless.

Source screening reports the offending file/line for direct prohibited tokens in student C++ source and local headers, excluding the supplied harness and generated output. It must not reject harmless mentions in comments or literals, or claim to detect every alias/macro evasion. No elaborate static-analysis dependency.

## Feedback and Exit Contract

- PASS / exit 0: every mandatory automated stage ran and passed. Final line: `PASS: All public preflight checks passed.`
- FAIL / exit 1: at least one observed assignment check failed, including compile/runtime/sanitizer defects or a student-program timeout. Keep original diagnostic details below a short explanation.
- INCOMPLETE / exit 2: no observed assignment failure, but a required stage could not run because tooling/sanitizer support is missing or an infrastructure error occurred. State the missing prerequisite and point to GitHub Actions.
- If failure and unavailable tooling coexist, report both, return 1, and identify unrun dependent checks. Never count an unrun check as passed. Stop dependent stages after compile failure while still checking independent files/README where possible.
- All summaries include `Passing all public checks does not guarantee full credit.` and a brief reminder that analysis answers, demonstration completeness, custom Stack implementation/use, and complexity need instructor review.

No auto-fix, external request, grade, machine-readable report mode, color/emoji dependency, or configurable check registry. Feedback explains what happened and how to rerun without writing the student's solution.

## Verification and Delivery

Two compact build phases: local validator/public tests, then workflow and copy/run/fix/rerun verification. The maintainer-only Python unittest file embeds synthetic fixture source strings and uses temporary directories, so students do not receive worked implementations. Test both correct variants and deliberate defects; test comment/literal scanner exclusions and INCOMPLETE handling. Do not require a large test matrix for unspecified C++ behavior.

Use read-only Actions permissions, a pinned checkout action, no stored checkout credentials or secrets, a GitHub-hosted Linux runner, and a bounded job. The package workflow remains inside its distribution directory in this development repository; it activates at `.github/workflows/validate.yml` after students copy it into their assignment repository. No publishing, repository creation, Canvas submission, or hosted CI success is implied by local planning/verification.

Technical references reviewed during the brainstorm: [Clang AddressSanitizer](https://clang.llvm.org/docs/AddressSanitizer.html) for instrumentation and platform-dependent leak checks; [GitHub secure use](https://docs.github.com/en/actions/reference/security/secure-use) for least-privilege workflows. Reverify runner/action pins when implementing rather than freezing unverified versions in the plan.

## Review Record

Specification and taxonomy/concrete-spec checks passed on 2026-09-05. The independent native Codex plan critique approved all four planning artifacts with no substantive findings. No implementation started. The next step is the first of the two build phases; no additional features or approval cycle was requested by the review.
