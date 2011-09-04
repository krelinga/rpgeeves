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

import re

from store import DiceVar
from store import User

def RequiresExpansion(expression):
  return '$' in expression

class Expander:
  def __init__(self, lookup_fn):
    self.__lookup_fn = lookup_fn

  def Expand(self, expression):
    while RequiresExpansion(expression):
      done_vars = set()
      for var in [x.lstrip('$') for x in re.findall(r'\$\w+', expression)]:
        if var in done_vars:
          continue
        result = self.__lookup_fn(var)
        expression = expression.replace('$%s' % var, result)
    return expression


class UnknownVariableException(Exception):
  def __init__(self, variable):
    Exception.__init__(self, 'Unknown variable %s' % variable)


def ExpandFromStore(variable, user):
  query = DiceVar.all()
  query.filter('owner =', user)
  query.filter('name =', variable)
  results = query.fetch(1)
  if len(results) == 0:
    raise UnknownVariableException(variable)
  return results[0].value
