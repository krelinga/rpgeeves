// class DiceView
function DiceView(starting_div_id, starting_set) {
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
    var deleted_checkbox_name = ['expression_deleted_', expressionId].join('')
    parts.push('<input type="checkbox" name="')
    parts.push(deleted_checkbox_name)
    parts.push('" id="')
    parts.push(deleted_checkbox_name)
    parts.push('"><label for="')
    parts.push(deleted_checkbox_name)
    parts.push('">Delete?</label>')

    parts.push('</form>')

    $("#" + starting_div_id).append(parts.join(''))
  }
}

diceView = new DiceView('expression_list', starting_set)
