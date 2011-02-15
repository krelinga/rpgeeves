#! /usr/bin/env python

import unittest

from expander import RequiresExpansion

class TestRequiresExpansion(unittest.TestCase):
  def test_WithVars(self):
    self.assertEqual(True, RequiresExpansion('$foo'))

  def test_WithoutVars(self):
    self.assertEqual(False, RequiresExpansion('bar'))


if __name__ == '__main__':
    unittest.main()
