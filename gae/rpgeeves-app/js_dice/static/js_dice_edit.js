// class DiceView
function DiceView(starting_div_id, starting_set) {

  // Helper function to generate HTML for a named textbox within a form.
  function htmlTextboxWithId(id, name, defaultValue) {
    var parts = []
    parts.push('<label for="')
    parts.push(id)
    parts.push('">')
    parts.push(name)
    parts.push('</label><input type="text" name="')
    parts.push(id)
    parts.push('" id="')
    parts.push(id)
    parts.push('" value="')
    parts.push(defaultValue)
    parts.push('" class="textbox" /><br />')
    return parts.join('')
  }

  this.nextExpressionId = 0
  this.expressions = []

  // Build the starting UI set.
  for (key in starting_set) {
    // Basic information about this expression
    var name = key
    var expression = starting_set[key]

    // Set up the internal representation of this expression
    var expressionId = this.nextExpressionId;
    this.nextExpressionId++;
    var internalExpression = {}
    internalExpression.name = name
    internalExpression.expression = expression
    this.expressions[expressionId] = internalExpression

    // Build some HTML to represent this expression in our UI.
    var parts = []
    parts.push('<form id="expression_form_')
    parts.push(expressionId)
    parts.push('">')

    // Set up a checkbox to represent whether or not this element is deleted.
    var deletedCheckboxName = ['expression_deleted_', expressionId].join('')
    parts.push('<input type="checkbox" name="')
    parts.push(deletedCheckboxName)
    parts.push('" id="')
    parts.push(deletedCheckboxName)
    parts.push('" class="expression_deleted"><label for="')
    parts.push(deletedCheckboxName)
    parts.push('">Delete?</label><br />')

    // Set up a text box for the name of the expression
    parts.push(htmlTextboxWithId(['expression_name_', expressionId].join(''),
                                 'Name', name))

    // Set up a text box for the value of the expression
    parts.push(htmlTextboxWithId(['expression_value_', expressionId].join(''),
                                 'Value', expression))

    parts.push('</form>')

    $("#" + starting_div_id).append(parts.join(''))
  }

  // Add jquery handlers for marking an expression as deleted.
  $('form > input.expression_deleted').click(function() {
    if ($(this).prop('checked')) {
      // Freeze all releated textboxes
      $(this).parent().children('.textbox').prop('disabled', true)
    } else {
      // Unfreeze all releated textboxes
      $(this).parent().children('.textbox').prop('disabled', false)
    }
  })
}


diceView = new DiceView('expression_list', starting_set)
