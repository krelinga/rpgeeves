#! /usr/bin/env python

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
