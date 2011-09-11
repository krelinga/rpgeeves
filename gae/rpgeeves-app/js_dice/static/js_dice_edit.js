starting_set_json = '{"foo": "d20","bar": "2d10 + 3","baz": "3d4"}'
starting_set = $.evalJSON(starting_set_json)

// class DiceView
function DiceView(startingDivId, startingSet) {
  this.startingDivId = startingDivId
  this.nextExpressionId = 0

  // Build the starting UI set.
  for (key in startingSet) {
   if (startingSet.hasOwnProperty(key)) {
      // Basic information about this expression
      var name = key
      var expression = startingSet[key]
      this.newEntry(name, expression)
    }
  }


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
        var expressionName = $(this).parent().find('.expression_name').val()
        var expressionValue = $(this).parent().find('.expression_value').val()
        toSubmit[expressionName] = expressionValue
      }
    })

    $('#submit_error').html('submitting....')
    $.post("js_dice_edit", $.toJSON(toSubmit))
        .success(function() {
          $('#submit_error').html('')
          window.location.href = 'js_dice'
        })
        .error(function() {
          $('#submit_error').html('Submit failed!  Try again.')
        })
  })

  // Add a jquery hander to do cancel.
  $('#cancel_button').click(function() {
    window.location.href = 'js_dice'
  })

  // Add a jquery handler to do "new expression".
  betterThis = this
  $('#new_entry_button').click(function() {
    betterThis.newEntry('', '')
  })
}
DiceView.prototype.newEntry = function(name, value) {
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

  var expressionId = this.nextExpressionId;
  this.nextExpressionId++;

  // Build some HTML to represent this expression in our UI.
  var parts = []
  parts.push('<form>')

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
                               'Value', value, 'expression_value',
                               'expression_value_error'))

  parts.push('</form>')

  var startingDiv = $('#' + this.startingDivId)
  startingDiv.append(parts.join(''))

  // TODO(krelinga): there is a bunch of repeated work happening in the rest of this function.  Whenever someone adds any new expression, we re-create the keyup handlers for every other expression.  This means that adding new expressions is O(n^2) in the number of expressions I want to add, which sucks.  I doubt this will be a problem in practice, but it's ugly as sin from an engineering standpoint.

  // Add jquery handlers for marking an expression as deleted.
  startingDiv.find('form > input.expression_deleted').click(function() {
    if ($(this).prop('checked')) {
      // Freeze all releated textboxes
      $(this).parent().find('.expression_name').prop('disabled', true)
      $(this).parent().find('.expression_value').prop('disabled', true)
    } else {
      // Unfreeze all releated textboxes
      $(this).parent().find('.expression_name').prop('disabled', false)
      $(this).parent().find('.expression_value').prop('disabled', false)
    }
  })

  // Add jquery handlers for displaying errors if any element is given the same name as any other element.
  startingDiv.find('form > input.expression_name').keyup(function() {
    // Clear any existing errors
    startingDiv.find('form > .expression_name_error').html('')

    // Gather the values of every other expression.
    var expression_name_to_element = {}
    startingDiv.find('form > .expression_name').each(function() {
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
              $(expression_name_to_element[key][inner_key]).parent().find(
                  '.expression_name_error').html('Duplicate Name!')
            }
          }
        }
      }
    }
  })

  // Add jquery handlers for displaying parse errors if a dice expression is invalid.
  startingDiv.find('form > input.expression_value').keyup(function() {
    // Clear any existing errors
    var errorSpan = $(this).parent().find('.expression_value_error')
    errorSpan.html('')

    // Try to parse the current text value.
    var value = $(this).parent().find('input.expression_value').val()
    try {
      var tree = parse(value)
      
    } catch (error) {
      errorSpan.html(error)
    }
  })

  startingDiv.find('form > .expression_name').keyup()
  startingDiv.find('form > .expression_value').keyup()

}


diceView = new DiceView('expression_list', starting_set)
