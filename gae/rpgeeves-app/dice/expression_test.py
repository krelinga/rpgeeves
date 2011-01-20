#! /usr/bin/env python

import unittest

from expression import Evaluator
from expression import ParseError

class MockRandom:
  def __init__(self, *args):
    self.__current = 0
    self.__args = args

  def __call__(self, x, y):
    to_return = self.__args[self.__current]
    self.__current += 1
    return to_return


class TestExpression(unittest.TestCase):
  def setUp(self):
    self.__e = Evaluator()

  def test_Empty(self):
    self.assertEqual([], self.__e.Evaluate(''))

  def test_AllWhiteSpace(self):
    self.assertEqual([], self.__e.Evaluate('\r\n\t '))

  def test_SingleConstant(self):
    no_sign = self.__e.Evaluate('1')
    self.assertEqual(1, int(no_sign[0]))
    self.assertEqual(None, no_sign[0].sides())

    sign = self.__e.Evaluate('-1')
    self.assertEqual(-1, int(sign[0]))
    self.assertEqual(None, sign[0].sides())

  def test_SingleDice(self):
    # TODO(krelinga): update to use mock randint() function
    no_sign = self.__e.Evaluate('1d3')
    self.assertTrue(int(no_sign[0]) in [1, 2, 3])
    self.assertEqual(3, no_sign[0].sides())

    sign = self.__e.Evaluate('-1d3')
    self.assertTrue(int(sign[0]) in [-1, -2, -3])
    self.assertEqual(3, sign[0].sides())

  def test_Mix(self):
    mix = self.__e.Evaluate(' 3d8 + 2d4 - 1d6 + 4')
    self.assertEqual(7, len(mix))

  def test_ZeroSidedDice(self):
    self.assertRaises(ParseError, self.__e.Evaluate, '25d0')

  def test_TooManyDice(self):
    self.assertRaises(ParseError, self.__e.Evaluate, '10000d10')

  def test_MaxDice(self):
    self.__e.Evaluate('9999d10')

  def test_DontForceNumber(self):
    no_number = self.__e.Evaluate('d8')
    self.assertEqual(1, len(no_number))
    self.assertEqual(8, no_number[0].sides())

  def test_ParseFailureOnSignOnly(self):
    self.assertRaises(ParseError, self.__e.Evaluate, '+')

  def test_ReadComments(self):
    # TODO(krelinga): update to use mock randint() function
    constant = self.__e.Evaluate('1 (this is a comment)')
    self.assertEqual(1, int(constant[0]))
    self.assertEqual(None, constant[0].sides())
    self.assertNotEqual(-1, str(constant[0]).find('this is a comment'))

    dice = self.__e.Evaluate('1d3 (this is a comment)')
    self.assertTrue(int(dice[0]) in (1, 2, 3))
    self.assertEqual(3, dice[0].sides())
    self.assertNotEqual(-1, str(dice[0]).find('this is a comment'))

  def test_MultipleComments(self):
    dice = self.__e.Evaluate('1d3 (first comment) + 1d4 (second comment)')
    self.assertEqual(2, len(dice))
    self.assertNotEqual(-1, str(dice[0]).find('first comment'))
    self.assertNotEqual(-1, str(dice[1]).find('second comment'))

  def test_NoComment(self):
    self.assertEqual(-1, str(self.__e.Evaluate('1')[0]).find('('))

  def test_EmptyComment(self):
    self.assertEqual(-1, str(self.__e.Evaluate('1()')[0]).find('('))

  def test_StrayCloseComment(self):
    self.assertRaises(ParseError, self.__e.Evaluate, '1 (this is a ) comment)')

  def test_ColorSpecs(self):
    dice = self.__e.Evaluate('1d1 <red=1>')
    self.assertEqual(1, len(dice))
    self.assertEqual(1, int(dice[0]))
    self.assertEqual('red', dice[0].color())

    dice = self.__e.Evaluate('1d1 <red=2>')
    self.assertEqual(None, dice[0].color())

    dice = self.__e.Evaluate('1d1 <red=1> + 2d1<blue=1>')
    self.assertEqual(3, len(dice))
    self.assertEqual('red', dice[0].color())
    self.assertEqual('blue', dice[1].color())
    self.assertEqual('blue', dice[2].color())

    self.__e = Evaluator(MockRandom(1, 5, 6, 10, 20))
    dice = self.__e.Evaluate('5d20 <red=1 blue=4-6 green=19-20>')
    self.assertEqual(5, len(dice))
    self.assertEqual('red', dice[0].color())
    self.assertEqual('blue', dice[1].color())
    self.assertEqual('blue', dice[2].color())
    self.assertEqual(None, dice[3].color())
    self.assertEqual('green', dice[4].color())

    self.__e = Evaluator(MockRandom(1, 6, 10, 5, 20))
    self.assertEqual(5, len(dice))
    self.assertEqual('red', dice[0].color())
    self.assertEqual('blue', dice[1].color())
    self.assertEqual(None, dice[3].color())
    self.assertEqual('blue', dice[2].color())
    self.assertEqual('green', dice[4].color())

  def test_UnknownColor(self):
    self.assertRaises(ParseError, self.__e.Evaluate, '1d1 <asdf=2>')

  def test_ConstantWithColor(self):
    self.assertRaises(ParseError, self.__e.Evaluate, '1 <red=1>')

  def test_ColorWithStrayClose(self):
    self.assertRaises(ParseError, self.__e.Evaluate, '1d1 <red=1>>')

  def test_OverlappingColorRanges(self):
    self.__e = Evaluator(MockRandom(1, 2))
    self.assertRaises(ParseError, self.__e.Evaluate, '2d10 <red=1-2 green=2-3>')

  def test_D20DefaultColorRanges(self):
    self.__e = Evaluator(MockRandom(1, 20))
    dice = self.__e.Evaluate('2d20')
    self.assertEqual(2, len(dice))
    self.assertEqual('red', dice[0].color())
    self.assertEqual('green', dice[1].color())

if __name__ == '__main__':
    unittest.main()

