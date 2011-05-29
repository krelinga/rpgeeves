function rollOneDie(sides) {
  return Math.floor(1 + sides * Math.random())
}

function parsedExpressionToConsole(parsed) {
  console.log('parsed expression:')
  console.log('  error: ' + parsed.error)
  $.each(parsed.subexpressions, function(_, expression) {
    console.log('  expression:')
    console.log('     sign: ' + expression.sign)
    console.log('    count: ' + expression.count)
    console.log('        d: ' + expression.d)
    console.log('    sides: ' + expression.sides)
  })
}

function rollsToConsole(rolls, sum) {
  console.log('rolls:')
  console.log('  sum: ' + sum)
  $.each(rolls, function(_, roll) {
    console.log('  roll:')
    console.log('    sides: ' + roll.sides)
    console.log('    value: ' + roll.value)
  })
}

function parseDiceExpression(expression) {
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
    console.log('match = ' + match[0] + ", normalized = " + normalized)
  }

  diceArray = []
  var diceRe = /([-+])(\d*)([dD]?)(\d+)/
  $.each(matchArray, function(key, value) {
    var diceMatches = diceRe.exec(value)
    // TODO(krelinga): check that the match actually takes
    // TODO(krelinga): check that we don't have negative sides (or maybe this is impossible)
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

function rollDice(expressions) {
  var rollArray = []
  $.each(expressions, function(_, expression) {
    if (expression.d == '') {
      // This is a constant value.
      rollArray.push({
        sides: null,
        value: expression.sides,
      })
    } else {
      for (var i = 0; i < expression.count; ++i) {
        var multiple = 1
        if (expression.sign == '-') {
          multiple = -1
        }
        rollArray.push({
          sides: expression.sides,
          value: multiple * rollOneDie(expression.sides),
        })
      }
    }
  })
  return rollArray
}

function setResult(expression) {
  parsed = parseDiceExpression(expression)
  if (parsed.error != null) {
    $("#result_div").html("<font color='red'>" + parsed.error + "</font>")
  } else {
    $("#result_div").text(sumRolls(rollDice(parsed.subexpressions)))
  }
}

function sumRolls(subexpressions) {
  rolls = rollDice(parsed.subexpressions)
  var sum = 0
  $.each(rolls, function(_, roll) {
    sum += roll.value
  })
  return sum
}

$(document).ready(function() {
  $("#expression_submit").click(function(unused) {
    setResult($("#expression").val())
  })
  $("#expression").keyup(function(event) {
    if (event.keyCode == 13) {
      $("#expression_submit").click()
    }
  })
})

parsed = parseDiceExpression("3d20 + 1 + d30 + 12 - 10d20  ")
if (parsed.error != null) {
  alert('error: ' + parsed.error)
} else {
  parsedExpressionToConsole(parsed)
  rolls = rollDice(parsed.subexpressions)
  var sum = 0
  $.each(rolls, function(_, roll) {
    sum += roll.value
  })
  rollsToConsole(rolls, sum)
}
