---
topics: ["testing-patterns","C++ lexical screening"]
globs: ["tests/preflight/*.py"]
priority: low
auto_generated: true
derived_from: [cis277-assignment1-preflight]
evidence_count: 1
last_validated: 2026-09-05
---

# C++ lexical screening

- Include valid-language regressions around comment, string, character, and numeric-literal boundaries when screening prohibited C++ tokens.
- Retain the digit-separator case (`1'000` before a prohibited token): a scanner must not treat its apostrophe as an opening character literal that hides later source. Describe lexical screening limits explicitly.

## Evidence

The digit-separator variant failed, then passed after numeric tokenization was corrected; see the source-screening regression. See [reflection](../../reflection/cis277-assignment1-preflight-reflection.md) and [archive](../../archive/cis277-assignment1-preflight-archive.md).
