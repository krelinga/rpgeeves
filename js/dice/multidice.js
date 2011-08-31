symbolTable = {}

$(document).ready(function() {
  $("#new_expression_submit").click(function(_) {
    var newEntry = {
      name: $("#new_expression_name").val(),
      expression: $("#new_expression_value").val(),
      parseTree: null,
      result: null,
      error = null,
    }
    if (symbolTable[newEntry.name]) {
      alert("name " + newEntry.name + " is already used!")
      return
    }
    //TODO(krelinga): validate that name is legal.
    try {
      newEntry.parseTree = parse(newEntry.expression)
    } catch (error) {
      newEntry.error = error
    }
    // TODO(krelinga): lots of uninished work to be done here.....
    var parts = []
    parts.push("<tr><td><button id='roll_button_")
    parts.push(newEntry.name)
    parts.push("'>Roll!</button></td><td>")
    parts.push(newEntry.expression)
    parts.push("</td><td id='total_")
    parts.push(newEntry.name)
    parts.push("'></td><td id='parts_")
    parts.push(newEntry.name)
    parts.push("</td></tr>")
    $("#result_table").add(parts.join(""))
    $("#roll_button_" + newEntry.name).click(function() {
      
    }
  })
  $("#roll_all").click(function(_) {
    rollAll()
  })
})

var entries = {}

var nextEntryKey = 0

function rollOneEntry(entry) {
  entry.parsedExpression = rpgeeves.dice.parseDiceExpression(entry.expression)
  if (entry.parsedExpression.subexpressions != null) {
    entry.rollArray =
        rpgeeves.dice.rollDice(entry.parsedExpression.subexpressions)
  } else {
    entry.rollArray = null
  }
}

function entryResultToHtml(entry) {
  parts = []
  if (entry.parsedExpression.error != null) {
    parts.push("<font color='red'>")
    parts.push(entry.parsedExpression.error)
    parts.push("</font>")
  } else {
    parts.push(rpgeeves.dice.sumRolls(entry.rollArray))
    parts.push(": ")
    $.each(entry.rollArray, function(_, rollValue) {
      parts.push(" ")
      parts.push(rpgeeves.dice.rollValueToString(rollValue))
    })
  }
  return parts.join("")
}

function rollAll() {
  $.each(entries, function(_, entry) {
    rollOneEntry(entry)
  })
  redrawEntries()
}

function redrawEntries() {
  var hook = $("#hook")
  var parts = []
  $.each(entries, function(key, entry) {
    parts.push("<div><input type='submit' value='Roll' id='roll_")
    parts.push(key)
    parts.push("'></input><input type='text' id='expression_")
    parts.push(key)
    parts.push("' value='")
    parts.push(entry.expression)
    parts.push("'></input>")
    if (entry.parsedExpression != null) {
      parts.push(entryResultToHtml(entry))
    }
    parts.push("</div>")
  })
  hook.html(parts.join(""))
  $.each(entries, function(key, entry) {
    var rollButton = $("#roll_" + key)
    var rollExpression = $("#expression_" + key)
    rollButton.click(function(_) {
      rollOneEntry(entry)
      redrawEntries()
    })
    rollExpression.keyup(function(event) {
      entries[key].expression = rollExpression.val()
      if (event.keyCode == 13) {
        rollButton.click()
      }
    })
  })
}
