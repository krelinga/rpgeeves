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
  return new NamedResult(found, this.name)
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

// class ConstantResult
function ConstantResult(value) {
  this.value = value
}
ConstantResult.prototype.toString = function() {
  return String(this.value)
}

// class DiceResult
function DiceResult(sides, result) {
  this.sides = sides
  this.result = result
}
DiceResult.prototype.toString = function() {
  var parts = []
  parts.push(this.result)
  parts.push(" (d")
  parts.push(this.sides)
  parts.push(")")
  return parts.join("")
}

// class NamedResult
function NamedResult(child, name) {
  this.child = child
  this.name = name
}
NamedResult.prototype.toString = function() {
  var parts = []
  parts.push(this.child.toString())
  parts.push(" [")
  parts.push(this.name)
  parts.push("]")
  return parts.join("")
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
