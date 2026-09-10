import importlib.util
import pathlib
import unittest

spec=importlib.util.spec_from_file_location('scanner',pathlib.Path(__file__).with_name('check_undefined_calls.py'))
scanner=importlib.util.module_from_spec(spec);spec.loader.exec_module(scanner)

class RegexScanning(unittest.TestCase):
    def calls(self,source):
        return set(scanner.CALL_RE.findall(scanner.strip_code(source)))

    def test_return_and_arrow_literals(self):
        for source in ["return /^robot_(0[1-9]|10)$/.test(id); missing();",
                       "owned.find(id=>/^robot_(?:0[1-9]|10)$/.test(id)); missing();",
                       "owned.find(id =>  /^robot_(?:0[1-9]|10)$/.test(id)); missing();",
                       "return /* comment */ /^robot_(0[1-9]|10)$/.test(id); missing();"]:
            with self.subTest(source=source):
                calls=self.calls(source);self.assertNotIn('robot_',calls);self.assertIn('missing',calls)

    def test_nested_template_expression_regex(self):
        source="const label=`${(() => { return /[}']robot_(x)/.test(id); })()} ${missing()}`; after();"
        calls=self.calls(source)
        self.assertNotIn('robot_',calls);self.assertIn('missing',calls);self.assertIn('after',calls)

    def test_real_robot_call_still_reported(self):
        self.assertIn('robot_',self.calls('return robot_(id);'))

    def test_division_does_not_hide_missing_calls(self):
        for source in ['return value / missing() / divisor;', 'return "value" / missing() / divisor;',
                       'const value=total / missing() / scale;', 'const result=fn() / missing() / scale;', 'return obj.return / missing() / scale;']:
            with self.subTest(source=source):self.assertIn('missing',self.calls(source))

    def test_escapes_and_character_class_slashes(self):
        source=r"return /[\/'\"]robot_(x)/g.test(id); missing();"
        calls=self.calls(source);self.assertNotIn('robot_',calls);self.assertIn('missing',calls)

    def test_line_numbers_remain_accurate(self):
        source='function f(){\n return /^robot_(x)$/.test(id);\n}\nmissing();'
        self.assertEqual(scanner.strip_code(source).count('\n'),source.count('\n'))
        self.assertIn('missing',scanner.strip_code(source).splitlines()[3])

if __name__=='__main__':unittest.main()
