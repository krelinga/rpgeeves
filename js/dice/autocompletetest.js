$(document).ready(function() {
  var options = [
    "foo",
    "bar",
    "baz",
  ]
  $("#roll_name").autocomplete({
    source: options,
    delay: 0,
  })
})
