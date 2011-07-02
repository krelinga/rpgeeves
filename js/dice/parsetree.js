// TODO(krelinga): consider unifying *Expression and *Result classes, some are
// very similar or identical (Sum, for instance).

////////////////////////////////////////////////////////////////////////////////
// Parse tree nodes
////////////////////////////////////////////////////////////////////////////////

// class SumExpression
function SumExpression(children) {
  this.children = children
}
SumExpression.prototype.toString = function() {
  var parts = []
  var first = true
  for (key in this.children) {
    if (!first) {
      parts.push(" ")
    }
    var childString = this.children[key].toString()
    if (childString.substr(0, 1) != "-" && !first) {
      parts.push("+ ")
    } else if (childString.substr(0, 2) == "- " && first) {
      parts.push("-")
      childString = childString.substr(2)
    }
    parts.push(childString)

    first = false
  }

  return parts.join("")
}
SumExpression.prototype.roll = function(symbolTable, roller) {
  var childResults = []
  for (key in this.children) {
    var child = this.children[key]
    childResults.push(child.roll(symbolTable, roller))
  }
  return new SumResult(childResults)
}
SumExpression.prototype.debugString = function() {
  var parts = []
  var childParts = []
  for (key in this.children) {
    var child = this.children[key]
    childParts.push(child.debugString())
  }
  parts.push("SumExpression([")
  parts.push(childParts.join(", "))
  parts.push("])")
  return parts.join("")
}
SumExpression.prototype.serialize = function() {
  var childrenSerialized = []
  for (key in this.children) {
    var child = this.children[key]
    childrenSerialized.push(child.serialize())
  }
  var toReturn = {
    "type": "sum",
    "children": childrenSerialized,
  }
  return toReturn
}

// class NegateExpression
function NegateExpression(child) {
  this.child = child
}
NegateExpression.prototype.toString = function() {
  var parts = []
  // TODO(krelinga): considering dropping the trailing space after "-" by
  // default.  The Sum Expression's toString() can re-add it if necessary.
  parts.push("- ")
  parts.push(this.child.toString())
  return parts.join("")
}
NegateExpression.prototype.roll = function(symbolTable, roller) {
  return new NegateResult(this.child.roll(symbolTable, roller))
}
NegateExpression.prototype.debugString = function() {
  var parts = []
  parts.push("NegateExpression(")
  parts.push(this.child.debugString())
  parts.push(")")
  return parts.join("")
}
NegateExpression.prototype.serialize = function() {
  var toReturn = {
    "type": "negate",
    "child": this.child.serialize(),
  }
  return toReturn
}

// class ConstantExpression
function ConstantExpression(value) {
  this.value = value
}
ConstantExpression.prototype.toString = function() {
  return String(this.value)
}
ConstantExpression.prototype.roll = function(symbolTable, roller) {
  return new ConstantResult(this.value)
}
ConstantExpression.prototype.debugString = function() {
  var parts = []
  parts.push("ConstantExpression(")
  parts.push(String(this.value))
  parts.push(")")
  return parts.join("")
}
ConstantExpression.prototype.serialize = function() {
  var toReturn = {
    "type": "constant",
    "value": String(this.value),
  }
  return toReturn
}

// class DiceExpression
function DiceExpression(count, sides) {
  this.count = count
  this.sides = sides
}
DiceExpression.prototype.toString = function() {
  var parts = []
  parts.push(this.count)
  parts.push("d")
  parts.push(this.sides)
  return parts.join("")
}
DiceExpression.prototype.roll = function(symbolTable, roller) {
  var constants = []
  for (i = 0; i < this.count; ++i) {
    constants.push(new DiceResult(this.sides, roller(this.sides)))
  }
  return new SumResult(constants)
}
DiceExpression.prototype.debugString = function() {
  var parts = []
  parts.push("DiceExpression(")
  parts.push(String(this.count))
  parts.push(", ")
  parts.push(String(this.sides))
  parts.push(")")
  return parts.join("")
}
DiceExpression.prototype.serialize = function() {
  var toReturn = {
    "type": "dice",
    "count": String(this.count),
    "sides": String(this.sides),
  }
  return toReturn
}

// class NamedExpression
function NamedExpression(name) {
  this.name = name
}
NamedExpression.prototype.toString = function() {
  return this.name
}
NamedExpression.prototype.roll = function(symbolTable, roller) {
  var found = symbolTable[this.name]
  if (!found) {
    throw "unknown name: " + this.name
  }
  return new NamedResult(found.roll(symbolTable, roller), this.name)
}
NamedExpression.prototype.debugString = function() {
  var parts = []
  parts.push("NamedExpression('")
  parts.push(this.name)
  parts.push("')")
  return parts.join("")
}
NamedExpression.prototype.serialize = function() {
  var toReturn = {
    "type": "named",
    "name": this.name,
  }
  return toReturn
}

// class ParenExpression
function ParenExpression(child) {
  this.child = child
}
ParenExpression.prototype.toString = function() {
  var parts = []
  parts.push("(")
  parts.push(this.child.toString())
  parts.push(")")
  return parts.join("")
}
ParenExpression.prototype.roll = function(symbolTable, roller) {
  return new ParenResult(this.child)
}
ParenExpression.prototype.debugString = function() {
  var parts = []
  parts.push("ParenExpression(")
  parts.push(this.child.debugString())
  parts.push(")")
  return parts.join("")
}
ParenExpression.prototype.serialize = function() {
  var toReturn = {
    "type": "param",
    "child": this.child.serialize()
  }
  return toReturn
}

////////////////////////////////////////////////////////////////////////////////
// RollResult nodes.
////////////////////////////////////////////////////////////////////////////////

// class SumResult
function SumResult(children) {
  this.children = children
}
SumResult.prototype.toString = function() {
  var parts = []
  var first = true
  for (key in this.children) {
    if (!first) {
      parts.push(" ")
    }
    var childString = this.children[key].toString()
    if (childString.substr(0, 1) != "-" && !first) {
      parts.push("+ ")
    } else if (childString.substr(0, 2) == "- " && first) {
      parts.push("-")
      childString = childString.substr(2)
    }
    parts.push(childString)

    first = false
  }

  return parts.join("")
}
SumResult.prototype.total = function() {
  var total = 0
  for (key in this.children) {
    var child = this.children[key]
    total += child.total()
  }
  return total
}

// class NegateResult
function NegateResult(child) {
  this.child = child
}
NegateResult.prototype.toString = function() {
  var parts = []
  parts.push("- ")
  parts.push(this.child.toString())
  return parts.join("")
}
NegateResult.prototype.total = function() {
  return -1 * this.child.total()
}

// class ConstantResult
function ConstantResult(value) {
  this.value = value
}
ConstantResult.prototype.toString = function() {
  return String(this.value)
}
ConstantResult.prototype.total = function() {
  return this.value
}

// class DiceResult
function DiceResult(sides, result) {
  this.sides = sides
  this.result = result
}
DiceResult.prototype.toString = function() {
  var parts = []
  parts.push(this.result)
  parts.push(" [d")
  parts.push(this.sides)
  parts.push("]")
  return parts.join("")
}
DiceResult.prototype.total = function() {
  return this.result
}

// class NamedResult
function NamedResult(child, name) {
  this.child = child
  this.name = name
}
NamedResult.prototype.toString = function() {
  var parts = []
  parts.push("(")
  parts.push(this.child.toString())
  parts.push(") [")
  parts.push(this.name)
  parts.push("]")
  return parts.join("")
}
NamedResult.prototype.total = function() {
  return this.child.total()
}

// class ParenResult
function ParenResult(child) {
  this.child = child
}
ParenResult.prototype.toString = function() {
  var parts = []
  parts.push("(")
  parts.push(this.child.toString())
  parts.push(")")
  return parts.join("")
}
ParenResult.prototype.total = function() {
  return this.child.total()
}

////////////////////////////////////////////////////////////////////////////////
// Parse a string into a Parse Tree
////////////////////////////////////////////////////////////////////////////////
function parse(stringExpression) {
  if (stringExpression.length == 0) {
    throw "Syntax error: empty expression"
  }
  var firstTokenRegex = /\s*(-?)\s*(?:((\d*)\s*d\s*(\d+))|(\d+)|([a-zA-Z0-9.]+))\s*/i
  var laterTokenRegex = /\s*([-+])\s*(?:((\d*)\s*d\s*(\d+))|(\d+)|([a-zA-Z0-9.]+))\s*/i

  var children = []
  var rawChildren = []
  var first = true
  while (stringExpression.length > 0) {
    var re = first ? firstTokenRegex : laterTokenRegex
    var match = re.exec(stringExpression)
    if (!match) {
      if (first) {
        throw "Syntax error at start of expression"
      } else {
        var parts = []
        parts.push("Syntax error after: '")
        parts.push(rawChildren[rawChildren.length - 1])
        parts.push("'")
        throw parts.join("")
      }
    } else if (match.index != 0) {
      var parts = []
      parts.push("Syntax error near: '")
      parts.push(stringExpression.substr(0, match.index))
      parts.push("'")
      throw parts.join("")
    } else {
      // If we get here then it looks like there isn't a syntax error.
      var newChild = null
      if (match[2]) {
        if (match[3]) {
          newChild = new DiceExpression(parseInt(match[3]), parseInt(match[4]))
        } else {
          newChild = new DiceExpression(1, parseInt(match[4]))
        }
      } else if (match[5]) {
        newChild = new ConstantExpression(parseInt(match[5]))
      } else if (match[6]) {
        newChild = new NamedExpression(match[6])
      }

      if (match[1] == "-") {
        newChild = new NegateExpression(newChild)
      }
      children.push(newChild)
      rawChildren.push(match[0])
      first = false
      stringExpression = stringExpression.substr(match[0].length)
    }
  }
  return new SumExpression(children)
}

function roll(sides) {
  return Math.floor(1 + sides * Math.random())
}
