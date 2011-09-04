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

var totalCells = 0

$(document).ready(function() {
  $("#new_name").focus()
  $("#new_button").click(function(event) {
    var table = $("#table")
    var newVal = $("#new_name").val()
    if (table.children().length == 0) {
      var parts = []
      parts.push("<tr><td>")
      parts.push(newVal)
      parts.push("</td><td>")
      parts.push(totalCells++)
      parts.push("</td></tr>")
      table.append(parts.join(""))
    } else {
      var foundSmaller = $("#table tr:first-child td:first-child")
      if (foundSmaller.html() > newVal) {
        var parts = []
        parts.push("<tr><td>")
        parts.push(newVal)
        parts.push("</td><td>")
        parts.push(totalCells++)
        parts.push("</td></tr>")
        $("#table").prepend(parts.join(""))
      } else {
        $("#table tr td:first-child").each(function(_, value) {
          if ($(value).html() < newVal) {
            foundSmaller = $(value)
          }
        })
        var parts = []
        parts.push("<tr><td>")
        parts.push(newVal)
        parts.push("</td><td>")
        parts.push(totalCells++)
        parts.push("</td></tr>")
        $(foundSmaller).parent().after(parts.join(""))
      }
    }
  })
})
