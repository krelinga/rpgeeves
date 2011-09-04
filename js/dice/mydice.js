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
