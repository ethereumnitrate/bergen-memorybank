"""Synthetic/de-identified fixtures; no real student data or student work.

Strategy: verify CLI outcomes, compiler boundaries, and real C++ defect detection.
Not tested: unspecified constructor edge cases, Stack underflow, copying, grading,
exact demo output, timing complexity, or hosted Actions execution.
"""
import ast
import contextlib
import importlib.util
import io
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

PACKAGE = Path(__file__).resolve().parents[2] / "packages/cis277-assignment1-preflight"
STACK = r'''#pragma once
#include <cstddef>
#include <vector>
template<class T> class Stack {
    std::vector<T> items;
public:
    explicit Stack(int) {}
    void push(const T& value) { items.push_back(value); }
    T pop() { T value = items.back(); items.pop_back(); return value; }
    T& top() { return items.back(); }
    bool empty() const { return items.empty(); }
    size_t size() const { return items.size(); }
};
'''
LINKED_STACK = r'''#pragma once
#include <cstddef>
template<class T> class Stack {
    struct Node { T value; Node* next; };
    Node* head = nullptr;
    size_t count = 0;
public:
    Stack() = default;
    ~Stack() { while (!empty()) pop(); }
    void push(const T& value) { head = new Node{value, head}; ++count; }
    T pop() { Node* old = head; T value = old->value;
        head = old->next; delete old; --count; return value; }
    T& top() { return head->value; }
    bool empty() const { return count == 0; }
    size_t size() const { return count; }
};
'''
POOL = r'''#pragma once
#include <cstddef>
#include <vector>
class MemoryPool {
    size_t bytes;
    std::vector<unsigned char*> blocks;
    std::vector<void*> free_blocks;
public:
    MemoryPool(size_t size, size_t count) : bytes(size) {
        for (size_t i=0; i<count; ++i) {
            auto p = new unsigned char[size];
            blocks.push_back(p); free_blocks.push_back(p);
        }
    }
    ~MemoryPool() { for (auto p : blocks) delete[] p; }
    void* allocate() {
        if (free_blocks.empty()) return nullptr;
        void* p = free_blocks.back(); free_blocks.pop_back(); return p;
    }
    bool deallocate(void* p) {
        bool owned = false;
        for (auto b : blocks) if (p == b) owned = true;
        if (!owned) return false;
        for (auto b : free_blocks) if (p == b) return false;
        free_blocks.push_back(p); return true;
    }
    size_t availableBlocks() const { return free_blocks.size(); }
    size_t allocatedBlocks() const { return blocks.size()-free_blocks.size(); }
    size_t blockSize() const { return bytes; }
    size_t capacity() const { return bytes*blocks.size(); }
};
'''
README = "# CIS-277 Assignment 1: Network Packet Buffer Pool\n" + "".join(
    "\n## " + heading + "\nSynthetic fixture content.\n"
    for heading in ("Student", "Description", "Stack Implementation", "How to Compile", "How to Run", "Analysis Questions")
)


class ValidatorTests(unittest.TestCase):
    def setUp(self):
        self.assertTrue((PACKAGE / "validate.py").is_file(), "The planned validator is not implemented")
        self.assertTrue((PACKAGE / "tests/public_tests.cpp").is_file(), "The public harness is not implemented")
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        shutil.copytree(PACKAGE, self.root, dirs_exist_ok=True)
        self.write("Stack.h", STACK)
        self.write("MemoryPool.h", POOL)
        self.write("MemoryPool.cpp", '#include "MemoryPool.h"\n')
        self.write("main.cpp", '#include "MemoryPool.h"\nint main() { MemoryPool p(7, 1); return p.capacity() == 7 ? 0 : 1; }\n')
        self.write("README.md", README)
        spec = importlib.util.spec_from_file_location("preflight_under_test", self.root / "validate.py")
        self.runner = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.runner)

    def write(self, name, content):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")

    def run_controlled(self, action=None):
        commands = []
        def execute(command, **kwargs):
            commands.append((command, kwargs))
            if action:
                result = action(command, kwargs)
                if result is not None:
                    return result
            return subprocess.CompletedProcess(command, 0, "", "")
        output = io.StringIO()
        with mock.patch.object(self.runner.subprocess, "run", side_effect=execute), contextlib.redirect_stdout(output):
            code = self.runner.main([])
        return code, output.getvalue(), commands

    def assert_outcome(self, result, code, *messages):
        self.assertEqual(result[0], code, result[1])
        for message in messages:
            self.assertIn(message, result[1])
        self.assertIn("Passing all public checks does not guarantee full credit.", result[1])

    def real_run(self):
        if not shutil.which(os.environ.get("CXX", "g++")):
            self.skipTest("Real compiler unavailable; boundary scenarios still run")
        return subprocess.run([sys.executable, str(self.root / "validate.py")], capture_output=True, text=True, timeout=240)

    def test_complete_run_has_independent_bounded_builds_and_cleanup(self):
        before = {p.relative_to(self.root): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        code, output, commands = self.run_controlled()
        self.assert_outcome((code, output), 0, "PASS: All public preflight checks passed.")
        builds = [command for command, kwargs in commands if "-o" in command]
        self.assertEqual(len(builds), 5)  # regular pair, harmless probe, ASan pair
        tests = [c for c in builds if any(str(x).endswith("public_tests.cpp") for x in c)]
        self.assertEqual(len(tests), 2)
        for command in tests:
            self.assertFalse(any(str(x).endswith("main.cpp") for x in command))
            self.assertIn("-std=c++17", command)
            self.assertNotIn("-Werror", command)
        for command, kwargs in commands:
            self.assertIn(kwargs["timeout"], (10, 60))
            self.assertFalse(kwargs.get("shell", False))
        for command in builds:
            self.assertFalse(Path(command[command.index("-o") + 1]).exists())
        after = {p.relative_to(self.root): p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        self.assertEqual(before, after)

    def test_missing_file_and_readme_failure_survive_unavailable_compiler(self):
        (self.root / "Stack.h").unlink()
        self.write("README.md", README.replace("## Description", "## Other"))
        def missing(command, kwargs):
            raise FileNotFoundError("synthetic unavailable compiler")
        self.assert_outcome(self.run_controlled(missing), 1, "Stack.h", "Description", "UNRUN", "GitHub Actions", "python validate.py")

    def test_readme_fenced_and_empty_headings_do_not_count(self):
        for readme in (README.replace("## Student", "```\n## Student\n```"), README.replace("## Student\nSynthetic fixture content.", "## Student")):
            with self.subTest(readme=readme):
                self.write("README.md", readme)
                self.assert_outcome(self.run_controlled(), 1, "Student", "README")

    def test_source_screening_ignores_literals_comments_harness_and_builds(self):
        self.write("support/mentions.hpp", r'''// std::stack<int> ignored;
/* std::stack */
const char* a = "escaped \\\" std::stack";
const char* b = R"tag(text " std::stack // )tag";
const char c = '"';
''')
        self.write("build/generated.cpp", "std::stack<int> generated;")
        with (self.root / "tests/public_tests.cpp").open("a", encoding="utf-8") as stream:
            stream.write("\n// std::stack\n")
        self.assert_outcome(self.run_controlled(), 0)
        self.write("support/bad.hxx", "// harmless\nstd /* gap */ :: stack<int> prohibited;\n")
        self.assert_outcome(self.run_controlled(), 1, "support/bad.hxx:2", "std::stack")
        self.write("support/bad.hxx", "const int number = 1'000;\nstd::stack<int> prohibited;\nconst char c = 'x';\n")
        self.assert_outcome(self.run_controlled(), 1, "support/bad.hxx:2", "std::stack")

    def test_missing_tool_and_unsupported_sanitizer_are_incomplete(self):
        def missing(command, kwargs):
            raise FileNotFoundError("synthetic missing compiler")
        self.assert_outcome(self.run_controlled(missing), 2, "INCOMPLETE", "UNRUN", "GitHub Actions")
        def unsupported(command, kwargs):
            if any(str(x).endswith("asan_probe.cpp") for x in command):
                return subprocess.CompletedProcess(command, 1, "", "unsupported sanitizer")
        self.assert_outcome(self.run_controlled(unsupported), 2, "unsupported sanitizer", "UNRUN", "GitHub Actions")

    def test_student_sanitizer_build_failure_is_failure_after_successful_probe(self):
        def failed(command, kwargs):
            if "-fsanitize=address" in command and any(str(x).endswith("public_tests.cpp") for x in command):
                return subprocess.CompletedProcess(command, 1, "", "synthetic student linker defect")
        self.assert_outcome(self.run_controlled(failed), 1, "synthetic student linker defect", "UNRUN", "FAIL")

    def test_compile_failure_and_runtime_timeout_identify_unrun_or_hang(self):
        def failed(command, kwargs):
            if any(str(x).endswith("main.cpp") for x in command):
                return subprocess.CompletedProcess(command, 1, "", "synthetic syntax defect")
        self.assert_outcome(self.run_controlled(failed), 1, "synthetic syntax defect", "UNRUN")
        def hung(command, kwargs):
            if len(command) == 1 and "demo" in str(command[0]):
                raise subprocess.TimeoutExpired(command, kwargs["timeout"])
        self.assert_outcome(self.run_controlled(hung), 1, "timeout", "hang", "input prompt")

    def test_malformed_settings_stop_before_student_checks(self):
        original = self.runner.ASSIGNMENT.copy()
        variants = ({}, {"required_files": "main.cpp"}, {"forbidden_tokens": [""]}, {"demo_sources": ["../escape.cpp"]}, {"compiler_flags": []}, {"readme_headings": [7]}, {"assignment_name": ""})
        for update in variants:
            with self.subTest(update=update):
                self.runner.ASSIGNMENT = {} if not update else dict(original, **update)
                result = self.run_controlled()
                self.assert_outcome(result, 2, "configuration", "instructor")
                self.assertEqual(result[2], [])

    def test_replacement_settings_and_harness_reuse_unchanged_runner(self):
        replacement = {
            "assignment_name": "Synthetic Counter", "required_files": ["counter.h", "counter.cpp", "demo.cpp", "README.md"],
            "readme_title": "# Synthetic Counter", "readme_headings": ["Notes"],
            "forbidden_tokens": ["std::vector"], "demo_sources": ["demo.cpp", "counter.cpp"],
            "test_sources": ["counter.cpp"], "compiler_flags": ["-std=c++17", "-Wall"],
            "manual_review_notes": ["Review counter explanation."],
        }
        source = (self.root / "validate.py").read_text(encoding="utf-8")
        tree = ast.parse(source)
        assignment = next(n for n in tree.body if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == "ASSIGNMENT" for t in n.targets))
        lines = source.splitlines(keepends=True)
        self.write("validate.py", "".join(lines[:assignment.lineno-1]) + "ASSIGNMENT = " + repr(replacement) + "\n" + "".join(lines[assignment.end_lineno:]))
        for name in ("Stack.h", "MemoryPool.h", "MemoryPool.cpp", "main.cpp"):
            (self.root / name).unlink()
        self.write("counter.h", "int next_value(int value);\n")
        self.write("counter.cpp", '#include "counter.h"\nint next_value(int value) { return value + 1; }\n')
        self.write("demo.cpp", '#include "counter.h"\nint main() { return next_value(0) == 1 ? 0 : 1; }\n')
        self.write("tests/public_tests.cpp", '#include "counter.h"\nint main() { return next_value(5) == 6 ? 0 : 1; }\n')
        self.write("README.md", "# Synthetic Counter\n## Notes\nSynthetic explanation.\n")
        self.runner.ASSIGNMENT = replacement
        controlled = self.run_controlled()
        self.assert_outcome(controlled, 0, "Synthetic Counter", "Review counter explanation.")
        self.assertNotIn("MemoryPool", controlled[1])
        self.assertNotIn("Stack", controlled[1])
        self.write("ban.hpp", "std::vector<int> values;")
        self.assert_outcome(self.run_controlled(), 1, "std::vector", "ban.hpp:1")
        (self.root / "ban.hpp").unlink()
        if shutil.which(os.environ.get("CXX", "g++")):
            result = self.real_run()
            self.assert_outcome((result.returncode, result.stdout), 0, "Synthetic Counter")
            self.write("counter.cpp", "int next_value(int value) { return value; }\n")
            result = self.real_run()
            self.assert_outcome((result.returncode, result.stdout), 1, "FAIL")

    def test_real_valid_dynamic_and_linked_stack_fixtures(self):
        for stack in (STACK, LINKED_STACK):
            with self.subTest(stack=stack[:60]):
                self.write("Stack.h", stack)
                result = self.real_run()
                self.assert_outcome((result.returncode, result.stdout), 0, "PASS: All public preflight checks passed.")

    def test_real_wrong_interface_and_behavior_are_rejected(self):
        defects = {
            "signature": POOL.replace("bool deallocate(void* p)", "int deallocate(void* p)"),
            "capacity": POOL.replace("return bytes*blocks.size()", "return blocks.size()"),
            "exhaustion": POOL.replace("return nullptr;", "return blocks.front();"),
            "reuse": POOL.replace("free_blocks.push_back(p); return true;", "free_blocks.insert(free_blocks.begin(), p); return true;"),
            "release": POOL.replace("if (!owned) return false;", "if (!owned) return true;"),
            "duplicate": POOL.replace("if (p == b) return false;", "if (p == b) return true;"),
        }
        for name, pool in defects.items():
            with self.subTest(defect=name):
                self.write("MemoryPool.h", pool)
                result = self.real_run()
                self.assert_outcome((result.returncode, result.stdout), 1, "FAIL")

    def test_real_asan_detects_overflow_and_leak(self):
        for defect in (POOL.replace("new unsigned char[size]", "new unsigned char[1]"), POOL.replace("delete[] p;", "(void)p;")):
            with self.subTest(defect=defect):
                self.write("MemoryPool.h", defect)
                result = self.real_run()
                self.assert_outcome((result.returncode, result.stdout), 1, "Sanitizer")


if __name__ == "__main__":
    unittest.main()
