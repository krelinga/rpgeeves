starting_set_json = '{"foo": "d20","bar": "2d10 + 3","baz": "3d4"}'
starting_set = starting_set_json.parseJSON()

// class DiceView
function DiceView(starting_div_id, starting_set) {

  // Helper function to generate HTML for a named textbox within a form.
  function htmlTextboxWithId(id, name, defaultValue, textbox_class_name,
                             error_class_name) {
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
    parts.push('" class="')
    parts.push(textbox_class_name)
    parts.push('" /><span style="color:red;" class="')
    parts.push(error_class_name)
    parts.push('"></span><br />')
    return parts.join('')
  }

  this.nextExpressionId = 0
  this.expressions = []

  // Build the starting UI set.
  for (key in starting_set) {
   if (starting_set.hasOwnProperty(key)) {
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
                                   'Name', name, 'expression_name',
                                   'expression_name_error'))

      // Set up a text box for the value of the expression
      parts.push(htmlTextboxWithId(['expression_value_', expressionId].join(''),
                                   'Value', expression, 'expression_value',
                                   'expression_value_error'))

      parts.push('</form>')

      $("#" + starting_div_id).append(parts.join(''))
    }
  }

  // Add jquery handlers for marking an expression as deleted.
  $('form > input.expression_deleted').click(function() {
    if ($(this).prop('checked')) {
      // Freeze all releated textboxes
      $(this).parent().children('.expression_name').prop('disabled', true)
      $(this).parent().children('.expression_value').prop('disabled', true)
    } else {
      // Unfreeze all releated textboxes
      $(this).parent().children('.expression_name').prop('disabled', false)
      $(this).parent().children('.expression_value').prop('disabled', false)
    }
  })

  // Add jquery handlers for displaying errors if any element is given the same name as any other element.
  $('form > input.expression_name').keyup(function() {
    // Clear any existing errors
    $('form > .expression_name_error').html('')

    // Gather the values of every other expression.
    var expression_name_to_element = {}
    $('form > .expression_name').each(function() {
      var textbox = $(this)
      if (expression_name_to_element[textbox.val()]) {
        expression_name_to_element[textbox.val()].push(textbox)
      } else {
        expression_name_to_element[textbox.val()] = [textbox]
      }
    })

    // Set any errors for duplicated name.
    for (key in expression_name_to_element) {
      if (expression_name_to_element.hasOwnProperty(key)) {
        if (expression_name_to_element[key].length > 1) {
          for (inner_key in expression_name_to_element[key]) {
            if (expression_name_to_element[key].hasOwnProperty(inner_key)) {
              $(expression_name_to_element[key][inner_key]).parent().children(
                  '.expression_name_error').html('Duplicate Name!')
            }
          }
        }
      }
    }
  })

  // Add jquery handlers for displaying parse errors if a dice expression is invalid.
  $('form > input.expression_value').keyup(function() {
    // Clear any existing errors
    var errorSpan = $(this).parent().children('.expression_value_error')
    errorSpan.html('')

    // Try to parse the current text value.
    var value = $(this).parent().children('input.expression_value').val()
    try {
      var tree = parse(value)
      
    } catch (error) {
      errorSpan.html(error)
    }
  })

  // Add jquery handler to do submit.
  $('#submit_button').click(function() {
    // Check for errors
    var errorTextLength = 0
    $('.expression_name_error').each(function() {
      errorTextLength += $(this).html().length
    })
    $('.expression_value_error').each(function() {
      errorTextLength += $(this).html().length
    })
    if (errorTextLength > 0) {
      alert("can't submit, errors detected")
      return
    }

    // Build a JSON structure for all non-deleted entries.
    var toSubmit = {}
    $('form > input.expression_deleted').each(function() {
      if ($(this).prop('checked') == false) {
        var expressionName = $(this).parent().children('.expression_name').val()
        var expressionValue = $(this).parent().children('.expression_value').val()
        toSubmit[expressionName] = expressionValue
      }
    })
    $('#would_have_submitted').html(toSubmit.toJSONString())
  })
}


diceView = new DiceView('expression_list', starting_set)
