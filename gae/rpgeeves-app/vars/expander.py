#! /usr/bin/env python

import re

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
