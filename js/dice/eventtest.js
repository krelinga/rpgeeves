$(document).ready(function() {
  $("table").click(function(event) {
    var total = []
    for (key in event.target) {
      total.push(key)
    }
    total.sort()
    if ($(event.target).is("button")) {
      $(event.target).parent().parent().find(":nth-child(2)").html("clicked!")
    }
  })
})
