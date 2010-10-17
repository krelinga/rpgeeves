#! /usr/bin/env python

import string
import sys
import random
import re

class Entry:
  def __init__(self, value, description):
    self.__value = value
    self.__description = description

  def __str__(self):
    if self.__value >= 0:
      sign = '+'
    else:
      sign = '-'
    num = abs(self.__value)
    return '%s%d (%s)' % (sign, num, self.__description)

  def __int__(self):
    return self.__value


class ParseError(StandardError):
  def __init__(self, str):
    StandardError.__init__(self, str)


def __Clean(expression):
  cleaned = expression.lower().translate(string.maketrans('', ''),
                                         string.whitespace)
  if len(cleaned) == 0:
    return ''
  if not cleaned.startswith('-') and not cleaned.startswith('+'):
    return '+' + cleaned
  return cleaned


def __SplitSpecs(expression):
  cleaned = __Clean(expression)
  if len(cleaned) == 0:
    return []
  spec_re = r'[+-]\d+(?:d\d+)?'
  if not re.match('(' + spec_re + ')+$', cleaned):
    raise ParseError('couldn\'t parse "%s"' % cleaned)
  return re.findall(spec_re, cleaned)


def __EntryForConstant(sign, num):
  return Entry(int('%s%d' % (sign, num)), "constant")


def __EntryForDice(sign, sides):
  return Entry(int('%s%d' % (sign, random.randint(1, sides))), '1d%d' % sides)


def Evaluate(expression):
  output = []
  for spec in __SplitSpecs(expression):
    match = re.match(r'([+-])(\d+)(?:d(\d+))?', spec)
    assert match
    groups = match.groups()
    sign = groups[0]
    if not groups[2]:
      # This is a constant-valued expression
      num = int(groups[1])
      output.append(__EntryForConstant(sign, num))
    else:
      # This is a dice expression
      sign = groups[0]
      dice_cnt = int(groups[1])
      dice_sides = int(groups[2])
      for i in xrange(dice_cnt):
        output.append(__EntryForDice(sign, dice_sides))
  return output
