#! /usr/bin/env python

import string
import sys
import random
import re

class Entry:
  def __init__(self, value, description, sides=None, color=None):
    self.__value = value
    self.__description = description
    self.__sides = sides
    self.__color = color

  def __str__(self):
    if self.__value >= 0:
      sign = '+'
    else:
      sign = '-'
    num = abs(self.__value)
    if len(self.__description) > 0:
      desc_str = ' (%s)' % self.__description
    else:
      desc_str = ''
    return '%s%d%s' % (sign, num, desc_str)

  def __int__(self):
    return self.__value

  def sides(self):
    return self.__sides

  def color(self):
    return self.__color


class ParseError(StandardError):
  def __init__(self, str):
    StandardError.__init__(self, str)


def __Clean(expression):
  comment_re = r'\([^)]*\)'
  comments = re.findall(comment_re, expression)
  # save comments so that white space survives sanitization
  for i in xrange(len(comments)):
    expression = expression.replace(comments[i], 'comment_%d' % i, 1)
  cleaned = expression.lower().translate(string.maketrans('', ''),
                                         string.whitespace)
  # restore old comments
  for i in xrange(len(comments)):
    cleaned = cleaned.replace('comment_%d' % i, comments[i], 1)
  if len(cleaned) == 0:
    return ''
  if not cleaned.startswith('-') and not cleaned.startswith('+'):
    return '+' + cleaned
  return cleaned


def __SplitSpecs(expression):
  cleaned = __Clean(expression)
  if len(cleaned) == 0:
    return []
  spec_re = r'[+\-](?:\d+)?(?:d\d+)?(?:\([^)]*\))?(?:<[^>]*>)?'
  if not re.match('(' + spec_re + ')+$', cleaned):
    raise ParseError('couldn\'t parse "%s"' % cleaned)
  return re.findall(spec_re, cleaned)


def __EntryForConstant(sign, num, comment):
  if comment is None:
    comment = ''
  return Entry(int('%s%d' % (sign, num)), comment)


class ColorSpec:
  @staticmethod
  def __ColorRangeTester(value, range_start, range_end, color):
    if value >= range_start and value <= range_end:
      return color
    return None

  def __init__(self, spec_str):
    self.__tests = []
    groups = re.findall(r'(?:([a-z]+)=(\d+(?:-\d+)?))', spec_str)
    for (color, val_range) in groups:
      if color not in ('red', 'green', 'blue', 'yellow'):
        raise ParseError('color "%s" is not allowed' % color)
      if '-' in val_range:
        array_range = val_range.split('-')
        assert len(array_range) == 2
        range_start = array_range[0]
        range_end = array_range[1]
      else:
        range_start = int(val_range)
        range_end = range_start
      test = lambda x: ColorSpec.__ColorRangeTester(x, range_start, range_end, color)
      self.__tests.append(test)

  def ColorForValue(self, value):
    matches = [x(value) for x in self.__tests if x(value)]
    if len(matches) == 0:
      return None
    elif len(matches) == 1:
      return matches[0]
    else:
      raise ParseError("Color ranges should be non-overlapping.")


def __EntryForDice(sign, sides, comment, color_spec):
  if comment is not None:
    comment = ' ' + comment
  else:
    comment = ''
  value = random.randint(1, sides)
  if color_spec:
    color = color_spec.ColorForValue(value)
  else:
    color = None
  return Entry(int('%s%d' % (sign, value)), '1d%d%s' % (sides, comment), sides,
               color)


def Evaluate(expression):
  MAX_PARTS = 10 * 1000
  output = []
  total_parts = 0
  for spec in __SplitSpecs(expression):
    SIGN_RE = r'(?P<sign>[+\-])'
    COUNT_RE = r'(?P<count>\d+)?'
    DICE_RE = r'(?:d(?P<dice>\d+))?'
    COMMENT_RE = r'(?:\((?P<comment>[^)]*)\))?'
    COLOR_RE = r'(?:<(?P<color>[^>]*)>)?'
    match = re.match(SIGN_RE + COUNT_RE + DICE_RE + COMMENT_RE + COLOR_RE, spec)
    assert match
    groups = match.groupdict()
    sign = groups['sign']
    comment = groups['comment']
    if not groups['dice']:
      # This is a constant-valued expression
      if groups['color']:
        raise ParseError('Constant-valued parts can\'t use a color expression')
      total_parts += 1
      if total_parts >= MAX_PARTS:
        raise ParseError('Please use less than %d parts' % MAX_PARTS)
      if groups['count'] is None:
        raise ParseError('Couldn\'t parse "%s"' % spec)
      num = int(groups['count'])
      output.append(__EntryForConstant(sign, num, comment))
    else:
      # This is a dice expression
      sign = groups['sign']
      if not groups['count']:
        dice_cnt = 1
      else:
        dice_cnt = int(groups['count'])
      dice_sides = int(groups['dice'])
      if dice_sides < 1:
        raise ParseError('zero-sided dice are not allowed')
      color_spec = groups['color']
      if color_spec:
        color_spec = ColorSpec(color_spec)
      for i in xrange(dice_cnt):
        total_parts += 1
        if total_parts >= MAX_PARTS:
          raise ParseError('Please use less than %d parts' % MAX_PARTS)
        output.append(__EntryForDice(sign, dice_sides, comment, color_spec))
  return output

