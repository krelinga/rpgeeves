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
