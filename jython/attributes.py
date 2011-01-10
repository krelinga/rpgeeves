class Attribute(object):
  def __init__(self, score, temp_score=None):
    self.__score = score
    self.__temp_score = temp_score

  @property
  def score(self):
    return self.__score

  @property
  def temp_score(self):
    return self.__temp_score

  @staticmethod
  def __bonusFromScore(score):
    """Helper method for calculating a bonus from a score."""
    return (score - 10)/ 2

  @property
  def bonus(self):
    return Attribute.__bonusFromScore(self.score)

  @property
  def temp_bonus(self):
    if self.temp_score:
      return Attribute.__bonusFromScore(self.temp_score)
    return None


class Attributes(object):
  STR = "str"
  CON = "con"
  DEX = "dex"
  INT = "int"
  WIS = "wis"
  CHA = "cha"

  standard = [STR, CON, DEX, INT, WIS, CHA]
