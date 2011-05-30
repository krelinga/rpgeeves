var rpgeeves = rpgeeves || {}
rpgeeves.dice = rpgeeves.dice || {}

rpgeeves.dice.rollOneDie = function(sides) {
  return Math.floor(1 + sides * Math.random())
}

rpgeeves.dice.parseDiceExpression = function(expression) {
  toReturn = {
    error: null,
    subexpressions: null,
  }
  var noSpaces = expression.replace(/ /g, "")
  if (noSpaces.length == 0) {
    toReturn.error = "Zero-length expression"
    return toReturn
  }
  var normalized = null
  if (noSpaces[0] != "-" && noSpaces[0] != "+") {
    normalized = "+" + noSpaces
  } else {
    normalized = noSpaces
  }
  var re = /[-+]\d*[dD]?\d+/
  var match = null
  var matchArray = []
  while (true) {
    match = re.exec(normalized)
    if (match == null) {
      if (normalized.length == 0) {
        // there is simply no further string to consume
        break
      } else {
        // There is some kind of syntax error here
        toReturn.error = "syntax error near " + normalized
        return toReturn
      }
    }

    if (normalized.search(re) != 0) {
      toReturn.error = "syntax error near " + normalized
      return toReturn
    }

    matchArray.push(match[0])
    normalized = normalized.substr(match[0].length)
  }

  diceArray = []
  var diceRe = /([-+])(\d*)([dD]?)(\d+)/
  $.each(matchArray, function(key, value) {
    var diceMatches = diceRe.exec(value)
    // TODO(krelinga): check that the match actually takes
    // TODO(krelinga): check that we don't have negative sides (or maybe this
    // is impossible)
    var subexpression = {
      sign: diceMatches[1],
      count: diceMatches[2],
      d: diceMatches[3],
      sides: diceMatches[4],
    }
    if (subexpression.d == '') {
      // Hack: if there's no 'd' and a multi-digit constant then for some reason
      // the digits of this constant can get distributed over these two match
      // variables.  Recombine those here into a single one.
      subexpression.sides = Number(subexpression.count.toString(10) +
                                   subexpression.sides.toString(10))
      subexpression.count = ''
    } else {
      if (subexpression.count == '') {
        subexpression.count = 1
      }
    }
    diceArray.push(subexpression)
  })
  toReturn.subexpressions = diceArray

  return toReturn
}

rpgeeves.dice.rollDice = function(expressions) {
  var rollArray = []
  $.each(expressions, function(_, expression) {
    var multiple = 1
    if (expression.sign == '-') {
      multiple = -1
    }
    if (expression.d == '') {
      // This is a constant value.
      rollArray.push({
        sides: null,
        value: expression.sides * multiple,
      })
    } else {
      for (var i = 0; i < expression.count; ++i) {
        rollArray.push({
          sides: expression.sides,
          value: multiple * rpgeeves.dice.rollOneDie(expression.sides),
        })
      }
    }
  })
  return rollArray
}

rpgeeves.dice.sumRolls = function(rolls) {
  var sum = 0
  $.each(rolls, function(_, roll) {
    sum += roll.value
  })
  return sum
}

rpgeeves.dice.rollValueToString = function(roll) {
  var parts = []
  if (roll.value >= 0 ) {
    parts.push("+")
  }

  parts.push(roll.value)

  if (roll.sides != null) {
    if (roll.value >= 0) {
      parts.push(" (+d")
    } else {
      parts.push(" (-d")
    }
    parts.push(roll.sides)
    parts.push(")")
  }

  return parts.join("")
}
