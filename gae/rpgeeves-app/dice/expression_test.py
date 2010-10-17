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
    self.assertEqual(None, no_sign[0].sides())

    sign = Evaluate('-1')
    self.assertEqual(-1, int(sign[0]))
    self.assertEqual(None, sign[0].sides())

  def test_SingleDice(self):
    no_sign = Evaluate('1d3')
    self.assertTrue(int(no_sign[0]) in [1, 2, 3])
    self.assertEqual(3, no_sign[0].sides())

    sign = Evaluate('-1d3')
    self.assertTrue(int(sign[0]) in [-1, -2, -3])
    self.assertEqual(3, sign[0].sides())

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
    self.assertEqual(8, no_number[0].sides())

  def test_ParseFailureOnSignOnly(self):
    self.assertRaises(ParseError, Evaluate, '+')

  def test_ReadComments(self):
    constant = Evaluate('1 (this is a comment)')
    self.assertEqual(1, int(constant[0]))
    self.assertEqual(None, constant[0].sides())
    self.assertNotEqual(-1, str(constant[0]).find('this is a comment'))

    dice = Evaluate('1d3 (this is a comment)')
    self.assertTrue(int(dice[0]) in (1, 2, 3))
    self.assertEqual(3, dice[0].sides())
    self.assertNotEqual(-1, str(dice[0]).find('this is a comment'))


if __name__ == '__main__':
    unittest.main()

