var neverCall = function() {
  throw "Should never be called"
}

describe("ConstantExpression", function() {
  var expression = new ConstantExpression(10)

  it("should have a working toString()", function() {
    expect(expression.toString()).toEqual("10")
  })

  it("should have a working roll()", function() {
    var symbolTable = {}
    expect(expression.roll(symbolTable, neverCall).value).toEqual(10)
  })
})

describe("DiceExpression", function() {
  var expression = new DiceExpression(1, 6)

  it("should have a working toString()", function() {
    expect(expression.toString()).toEqual("1d6")
  })

  it("should have a working roll()", function() {
    var symbolTable = {}
    var roller = function(sides) {
      return 4
    }
    var result = expression.roll(symbolTable, roller)
    expect(result.children.length).toEqual(1)
    var child = result.children[0]
    expect(child.result).toEqual(4)
    expect(child.sides).toEqual(6)
  })
})

describe("NamedExpression", function() {
  var expression = new NamedExpression("somename")

  it("should have a working toString()", function() {
    expect(expression.toString()).toEqual("somename")
  })

  it("should have a working roll()", function() {
    var symbolTable = {"somename": new ConstantExpression(20)}
    var result = expression.roll(symbolTable, neverCall)
    expect(result.child.value).toEqual(20)
    expect(result.name).toEqual("somename")
  })

  it("should raise an exception on roll() with an unknown name", function() {
    var symbolTable = {}
    var fn = function() {
      expression.roll(symbolTable, neverCall)
    }
    expect(fn).toThrow("unknown name: somename")
  })
})

describe("ParenExpression", function() {
  var child = new ConstantExpression(10)
  var expression = new ParenExpression(child)

  it("should have a working toString()", function() {
    expect(expression.toString()).toEqual("(10)")
  })

  it("should have a working roll()", function() {
    var symbolTable = {}
    var result = expression.roll(symbolTable, neverCall)
    expect(result.child.value).toEqual(10)
  })
})

describe("NegateExpression", function() {
  var child = new ConstantExpression(10)
  var expression = new NegateExpression(child)

  it("should have a working toString()", function() {
    expect(expression.toString()).toEqual("- 10")
  })

  it("should have a working roll()", function() {
    var symbolTable = {}
    var result = expression.roll(symbolTable, neverCall)
    expect(result.child.value).toEqual(10)
  })
})

describe("SumExpression", function() {
  var subChildren = [new NegateExpression(new ConstantExpression(30)),
                     new ConstantExpression(40)]

  var children = [new ConstantExpression(10),
                  new NegateExpression(new ConstantExpression(20)),
                  new NamedExpression("foo"),
                  new NegateExpression(new DiceExpression(2, 10)),
                  new ParenExpression(new SumExpression(subChildren))]

  var expression = new SumExpression(children)

  it("should have a working toString()", function() {
    var expected = "10 - 20 + foo - 2d10 + (-30 + 40)"
    expect(expression.toString()).toEqual(expected)
  })

  it("should have a working roll()", function() {
    var symbolTable = {"foo": new ConstantExpression(100)}
    var roller = function(sides) {
      return 7
    }
    var result = expression.roll(symbolTable, roller)

    expect(result.children.length).toEqual(5)
    expect(result.children[0].value).toEqual(10)
    expect(result.children[1].child.value).toEqual(20)
    expect(result.children[2].name).toEqual("foo")
    expect(result.children[2].child.value).toEqual(100)
    expect(result.children[3].child.children.length).toEqual(2)
    expect(result.children[3].child.children[0].sides).toEqual(10)
    expect(result.children[3].child.children[0].result).toEqual(7)
    expect(result.children[3].child.children[1].sides).toEqual(10)
    expect(result.children[3].child.children[1].result).toEqual(7)
    expect(result.children[4].child.children.length).toEqual(2)
    expect(result.children[4].child.children[0].child.value).toEqual(30)
    expect(result.children[4].child.children[1].value).toEqual(40)
  })
})

describe("ConstantResult", function() {
  it("should have a working toString()", function() {
    var result = new ConstantResult(10)
    expect(result.toString()).toEqual("10")
  })
})

describe("DiceResult", function() {
  it("should have a working toString()", function() {
    var result = new DiceResult(20, 10)
    expect(result.toString()).toEqual("10 (d20)")
  })
})

describe("NamedResult", function() {
  it("should have a working toString()", function() {
    var result = new NamedResult(new ConstantResult(10), "test")
    expect(result.toString()).toEqual("10 [test]")
  })
})

describe("ParenResult", function() {
  it("should have a working toString()", function() {
    var result = new ParenResult(new ConstantResult(10))
    expect(result.toString()).toEqual("(10)")
  })
})

describe("NegateResult", function() {
  it("should have a working toString()", function() {
    result = new NegateResult(new ConstantExpression(10))
    expect(result.toString()).toEqual("- 10")
  })
})

describe("SumResult", function() {
  it("should have a working toString()", function() {
    var subChildren = [new NegateResult(new ConstantResult(30)),
                       new ConstantResult(40)]

    var children = [new ConstantResult(10),
                    new NegateResult(new ConstantResult(20)),
                    new NamedResult(new ConstantResult(50), "foo"),
                    new NegateResult(new DiceResult(10, 8)),
                    new ParenResult(new SumResult(subChildren))]

    var expression = new SumResult(children)
    var expected = "10 - 20 + 50 [foo] - 8 (d10) + (-30 + 40)"
    expect(expression.toString()).toEqual(expected)
  })
})
