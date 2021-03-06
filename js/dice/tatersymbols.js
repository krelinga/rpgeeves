// Copyright 2011 Andrew Kreling
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

taterSymbols = {
  // abilities
  "strength": new ConstantExpression(4),
  "dexterity": new ConstantExpression(2),
  "constitution": new ConstantExpression(4),
  "intelligence": new ConstantExpression(2),
  "wisdom": new ConstantExpression(3),
  "charisma": new ConstantExpression(-1),

  // saves
  "fortitude": parse("constitution + 9"),
  "reflex": parse("dexterity + 3"),
  "will": parse("wisdom + 3"),

  // Basic attacks
  "base_attack_bonus": new ConstantExpression(11),
  "grapple": parse("base_attack_bonus + strength"),

  // Skills
  "appraise": parse("intelligence"),
  "balance": parse("dexterity"),
  "bluff": parse("charisma"),
  "climb.ranks" : new ConstantExpression(4),
  "climb.misc_modifier": new ConstantExpression(2),
  "climb": parse("strength + climb.ranks + climb.misc_modifier"),
  "concentration": parse("constitution"),
  "craft_masonry.ranks" : new ConstantExpression(2),
  "craft_masonry": parse("intelligence + craft_masonry.ranks"),
  "craft_repair.ranks": new ConstantExpression(13),
  "craft_repair.misc_modifier": new ConstantExpression(2),
  "craft_repair": parse("intelligence + craft_repair.ranks + craft_repair.misc_modifier"),
  "decipher_script": parse("intelligence"),
  "diplomacy": parse("charisma"),
  "disable_device": parse("intelligence"),
  "disguise": parse("charisma"),
  "escape_artist": parse("dexterity"),
  "forgery": parse("intelligence"),
  "gather_information": parse("charisma"),
  "handle_animal": parse("charisma"),
  "heal": parse("wisdom"),
  "hide": parse("dexterity"),
  "intimidate.ranks": new ConstantExpression(12),
  "intimidate": parse("charisma + intimidate.ranks"),
  "jump.ranks": new ConstantExpression(4),
  "jump": parse("strength + jump.ranks"),
  "knowledge_tactics.ranks": new ConstantExpression(5),
  "knowledge_tactics": parse("intelligence + knowledge_tactics.ranks"),
  "listen.ranks": new ConstantExpression(5),
  "listen": parse("wisdom + listen.ranks"),
  "move_silently": parse("dexterity"),
  "open_lock": parse("dexterity"),
  "ride": parse("dexterity"),
  "search.ranks": new ConstantExpression(2),
  "search": parse("intelligence + search.ranks"),
  "sense_motive": parse("wisdom"),
  "sleight_of_hand": parse("dexterity"),
  "spellcraft": parse("intelligence"),
  "spot.ranks": new ConstantExpression(1),
  "spot": parse("wisdom + spot.ranks"),
  "survival.ranks": new ConstantExpression(6),
  "survival": parse("wisdom + survival.ranks"),
  "swim.ranks": new ConstantExpression(3),
  "swim": parse("strength + swim.ranks"),
  "tumble": parse("dexterity"),
  "use_magic_device": parse("charisma"),
  "use_rope": parse("dexterity"),
  "animal_empathy.ranks": new ConstantExpression(3),
  "animal_empathy": parse("charisma + animal_empathy.ranks")
}
