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
