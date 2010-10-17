#! /usr/bin/env python

import unittest

from expression import Evaluate
from expression import ParseError


class TestExpression(unittest.TestCase):
  def test_Empty(self):
    self.assertEqual([], Evaluate(''))

  def test_AllWhiteSpace(self):
    self.assertEqual([], Evaluate('\r\n\t '))

  def test_SingleConstant(self):
    no_sign = Evaluate('1')
    self.assertEqual(1, int(no_sign[0]))

    sign = Evaluate('-1')
    self.assertEqual(-1, int(sign[0]))

  def test_SingleDice(self):
    no_sign = Evaluate('1d3')
    self.assertTrue(int(no_sign[0]) in [1, 2, 3])

    sign = Evaluate('-1d3')
    self.assertTrue(int(sign[0]) in [-1, -2, -3])

  def test_Mix(self):
    mix = Evaluate(' 3d8 + 2d4 - 1d6 + 4')
    self.assertEqual(7, len(mix))

  def test_ZeroSidedDice(self):
    self.assertRaises(ParseError, Evaluate, '25d0')

  def test_TooManyDice(self):
    self.assertRaises(ParseError, Evaluate, '10000d10')

  def test_MaxDice(self):
    Evaluate('9999d10')

  def test_DontForceNumber(self):
    no_number = Evaluate('d8')
    self.assertEqual(1, len(no_number))

  def test_ParseFailureOnSignOnly(self):
    self.assertRaises(ParseError, Evaluate, '+')


if __name__ == '__main__':
    unittest.main()

