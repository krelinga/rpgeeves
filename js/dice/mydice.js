symbolTable = {
  "foo": parse("d20 + 2d10 + 1 - 3")
}

function setResult(expression) {
  var parts = []
  try {
    var parsed = parse(expression)
    var result = parsed.roll(symbolTable, roll)
    parts.push("<div>")
    parts.push(result.total())
    parts.push("</div>")
    parts.push("<div>")
    parts.push(result.toString())
    parts.push("</div>")
  } catch (error) {
    parts.push("<font color='red'>")
    parts.push(error)
    parts.push("</font>")
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
