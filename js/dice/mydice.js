function rollValueToString(roll) {
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

function setResult(expression) {
  var parsed = rpgeeves.dice.parseDiceExpression(expression)
  var parts = []
  if (parsed.error != null) {
    parts.push("<font color='red'>")
    parts.push(parsed.error)
    parts.push("</font>")
  } else {
    var rolls = rpgeeves.dice.rollDice(parsed.subexpressions)
    parts.push("<div>")
    parts.push(rpgeeves.dice.sumRolls(rolls))
    parts.push("</div>")
    $.each(rolls, function(_, roll) {
      parts.push("<div style='text-indent: 10px;'>")
      parts.push(rollValueToString(roll))
      parts.push("</div>")
    })
  }
  $("#result_div").html(parts.join(""))
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
  $("#expression").focus()
})
