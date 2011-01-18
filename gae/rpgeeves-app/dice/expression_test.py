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

  def test_MultipleComments(self):
    dice = Evaluate('1d3 (first comment) + 1d4 (second comment)')
    self.assertEqual(2, len(dice))
    self.assertNotEqual(-1, str(dice[0]).find('first comment'))
    self.assertNotEqual(-1, str(dice[1]).find('second comment'))

  def test_NoComment(self):
    self.assertEqual(-1, str(Evaluate('1')[0]).find('('))

  def test_EmptyComment(self):
    self.assertEqual(-1, str(Evaluate('1()')[0]).find('('))

  def test_StrayCloseComment(self):
    self.assertRaises(ParseError, Evaluate, '1 (this is a ) comment)')

  def test_ColorSpecs(self):
    dice = Evaluate('1d1 <red=1>')
    self.assertEqual(1, len(dice))
    self.assertEqual(1, int(dice[0]))
    self.assertEqual('red', dice[0].color())

    dice = Evaluate('1d1 <red=2>')
    self.assertEqual(None, dice[0].color())

    dice = Evaluate('1d1 <red=1> + 2d1<blue=1>')
    self.assertEqual(3, len(dice))
    self.assertEqual('red', dice[0].color())
    self.assertEqual('blue', dice[1].color())
    self.assertEqual('blue', dice[2].color())

  def test_UnknownColor(self):
    self.assertRaises(ParseError, Evaluate, '1d1 <asdf=2>')

  def test_ConstantWithColor(self):
    self.assertRaises(ParseError, Evaluate, '1 <red=1>')

  def test_ColorWithStrayClose(self):
    self.assertRaises(ParseError, Evaluate, '1d1 <red=1>>')


if __name__ == '__main__':
    unittest.main()

