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
