var keyToHuman = function(key) {
  // Replace all "_" with " "
  key = key.replace(/_/g, " ")
  return key
}

var humanToKey = function(key) {
  // Replace all " " with "_"
  key = key.replace(/ /g, "_")
  return key
}

$(document).ready(function() {
  var options = []

  for (key in taterSymbols) {
    if (key.indexOf(".") != -1) {
      continue
    }
    options.push(keyToHuman(key))
  }
  $("#roll_name").autocomplete({
    source: options,
    delay: 0,
    autoFocus: true,
  })
  $("#roll_name").focus()
  $("#roll_name").keyup(function(event) {
    if (event.keyCode == 13) {
      try {
        var roll_name = humanToKey($("#roll_name").val())
        var expression = "d20 + " + roll_name
        var parsed = parse(expression)
        var result = parsed.roll(taterSymbols, roll)
        $("#result").html(result.total() + " = " + result.toString())
      } catch (error) {
        $("#result").html("<font color=red>" + error + "</font>")
      }
      $("#roll_name").focus()
      $("#roll_name").select()
    }
  })
})
