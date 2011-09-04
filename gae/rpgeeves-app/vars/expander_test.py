#! /usr/bin/env python

# Copyright 2011 Andrew Kreling
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import unittest

from expander import RequiresExpansion
from expander import Expander

class TestRequiresExpansion(unittest.TestCase):
  def test_WithVars(self):
    self.assertEqual(True, RequiresExpansion('$foo'))

  def test_WithoutVars(self):
    self.assertEqual(False, RequiresExpansion('bar'))

class TestExpander(unittest.TestCase):
  @staticmethod
  def ExceptionOnExpand(expr):
    raise Exception('called with expr: %s' % expr)

  def test_NoVars(self):
    instance = Expander(TestExpander.ExceptionOnExpand)
    to_expand = 'no vars here'
    self.assertEqual(to_expand, instance.Expand(to_expand))

  def test_OneLevelVars(self):
    mapping = {'foo' : '1',
               'bar' : '2',
               'baz' : '3'}
    instance = Expander(lambda x: mapping[x])
    self.assertEqual('1 2 3', instance.Expand('$foo $bar $baz'))

  def test_DuplicateVars(self):
    mapping = {'foo' : '1',
               'bar' : '2'}
    instance = Expander(lambda x: mapping[x])
    self.assertEqual('1 2 1', instance.Expand('$foo $bar $foo'))

  def test_NestedVars(self):
    mapping = {'foo' : '1',
               'bar' : '2',
               'baz' : '3',
               'taters' : '$foo $bar',
               'pie' : '$bar $baz'}
    instance = Expander(lambda x: mapping[x])
    self.assertEqual('1 2 2 3', instance.Expand('$taters $pie'))


if __name__ == '__main__':
    unittest.main()
