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

  it("should have a working debugString()", function() {
    expect(expression.debugString()).toEqual("ConstantExpression(10)")
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

  it("should have a working debugString()", function() {
    expect(expression.debugString()).toEqual("DiceExpression(1, 6)")
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

  it("should have a working debugString()", function() {
    expect(expression.debugString()).toEqual("NamedExpression('somename')")
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

  it("should have a working debugString()", function() {
    expect(expression.debugString()).toEqual(
        "ParenExpression(ConstantExpression(10))")
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

  it("should have a working debugString()", function() {
    expect(expression.debugString()).toEqual(
        "NegateExpression(ConstantExpression(10))")
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

  it("should have a working debugString()", function() {
    expect(expression.debugString()).toEqual(
        "SumExpression([" +
            "ConstantExpression(10), " +
            "NegateExpression(ConstantExpression(20)), " +
            "NamedExpression('foo'), " +
            "NegateExpression(DiceExpression(2, 10)), " +
            "ParenExpression(SumExpression([" +
                "NegateExpression(ConstantExpression(30)), " +
                "ConstantExpression(40)" +
            "]))" +
        "])")
  })
})

describe("ConstantResult", function() {
  var result = new ConstantResult(10)

  it("should have a working toString()", function() {
    expect(result.toString()).toEqual("10")
  })

  it("should have a working total()", function() {
    expect(result.total()).toEqual(10)
  })
})

describe("DiceResult", function() {
  var result = new DiceResult(20, 11)

  it("should have a working toString()", function() {
    expect(result.toString()).toEqual("11 [d20]")
  })

  it("should have a working total()", function() {
    expect(result.total()).toEqual(11)
  })
})

describe("NamedResult", function() {
  var result = new NamedResult(new ConstantResult(12), "test")

  it("should have a working toString()", function() {
    expect(result.toString()).toEqual("(12) [test]")
  })

  it("should have a working total()", function() {
    expect(result.total()).toEqual(12)
  })
})

describe("ParenResult", function() {
  var result = new ParenResult(new ConstantResult(13))

  it("should have a working toString()", function() {
    expect(result.toString()).toEqual("(13)")
  })

  it("should have a working total()", function() {
    expect(result.total()).toEqual(13)
  })
})

describe("NegateResult", function() {
  var result = new NegateResult(new ConstantResult(14))

  it("should have a working toString()", function() {
    expect(result.toString()).toEqual("- 14")
  })

  it("should have a working total()", function() {
    expect(result.total()).toEqual(-14)
  })
})

describe("SumResult", function() {
  var subChildren = [new NegateResult(new ConstantResult(30)),
                     new ConstantResult(40)]

  var children = [new ConstantResult(10),
                  new NegateResult(new ConstantResult(20)),
                  new NamedResult(new ConstantResult(50), "foo"),
                  new NegateResult(new DiceResult(10, 8)),
                  new ParenResult(new SumResult(subChildren))]

  var result = new SumResult(children)

  it("should have a working toString()", function() {
    var expected = "10 - 20 + (50) [foo] - 8 [d10] + (-30 + 40)"
    expect(result.toString()).toEqual(expected)
  })

  it("should have a working total()", function() {
    expect(result.total()).toEqual(42)
  })
})

describe("parse", function() {
  it("should handle literals with no sign", function() {
    var expression = parse("10")
    expect(expression.debugString()).toEqual(
        "SumExpression([ConstantExpression(10)])")
  })

  it("should handle literals with sign", function() {
    var expression = parse("-10")
    expect(expression.debugString()).toEqual(
        "SumExpression([NegateExpression(ConstantExpression(10))])")
  })

  it("should handle dice with no count and no sign", function() {
    var expression = parse("d20")
    expect(expression.debugString()).toEqual(
        "SumExpression([DiceExpression(1, 20)])")
  })

  it("should handle dice with count and no sign", function() {
    var expression = parse("2d10")
    expect(expression.debugString()).toEqual(
        "SumExpression([DiceExpression(2, 10)])")
  })

  it("should handle dice with count and sign", function() {
    var expression = parse("-2d10")
    expect(expression.debugString()).toEqual(
        "SumExpression([NegateExpression(DiceExpression(2, 10))])")
  })

  it("should handle named expressions with no sign", function() {
    var expression = parse("foo")
    expect(expression.debugString()).toEqual(
        "SumExpression([NamedExpression('foo')])")
  })

  it("should handle named expressions with sign", function() {
    var expression = parse("-foo")
    expect(expression.debugString()).toEqual(
        "SumExpression([NegateExpression(NamedExpression('foo'))])")
  })

  it("should handle added second constant expression", function() {
    var expression = parse("1 + 2")
    expect(expression.debugString()).toEqual(
        "SumExpression([ConstantExpression(1), ConstantExpression(2)])")
  })

  it("should handle substracted second constant expression", function() {
    var expression = parse("1 - 2")
    expect(expression.debugString()).toEqual(
        "SumExpression([ConstantExpression(1), " +
                        "NegateExpression(ConstantExpression(2))])")
  })

  it("should handle added second dice with no count", function() {
    var expression = parse("1 + d6")
    expect(expression.debugString()).toEqual(
        "SumExpression([ConstantExpression(1), " +
                        "DiceExpression(1, 6)])")
  })

  it("should handle added second dice with count", function() {
    var expression = parse("1 + 2d6")
    expect(expression.debugString()).toEqual(
        "SumExpression([ConstantExpression(1), " +
                       "DiceExpression(2, 6)])")
  })

  it("should handle subtracted second dice with no count", function() {
    var expression = parse("1 - d6")
    expect(expression.debugString()).toEqual(
        "SumExpression([ConstantExpression(1), " +
                        "NegateExpression(DiceExpression(1, 6))])")
  })

  it("should handle subtracted second dice with count", function() {
    var expression = parse("1 - 2d6")
    expect(expression.debugString()).toEqual(
        "SumExpression([ConstantExpression(1), " +
                       "NegateExpression(DiceExpression(2, 6))])")
  })

  it("should handle added second name expression", function() {
    var expression = parse("1 + foo")
    expect(expression.debugString()).toEqual(
        "SumExpression([ConstantExpression(1), " +
                       "NamedExpression('foo')])")
  })

  it("should handle subtracted second named expression", function() {
    var expression = parse("1 - foo")
    expect(expression.debugString()).toEqual(
        "SumExpression([ConstantExpression(1), " +
                       "NegateExpression(NamedExpression('foo'))])")
  })

  it("should give parse error on empty expression", function() {
    var fn = function() {
      parse("")
    }
    expect(fn).toThrow("Syntax error: empty expression")
  })

  it("should give parse error on only junk in the expression", function() {
    var fn = function() {
      parse("$")
    }
    expect(fn).toThrow("Syntax error at start of expression")
  })

  it("should give parse error on junk at start of expression", function() {
    var fn = function() {
      parse("* 10")
    }
    expect(fn).toThrow("Syntax error near: '*'")
  })

  it("should give parse error on junk after good stuff", function() {
    var fn = function() {
      parse("10 + &")
    }
    expect(fn).toThrow("Syntax error after: '10 '")
  })

  it("should give parse error on dangling addition", function() {
    var fn = function() {
      parse("10 +")
    }
    expect(fn).toThrow("Syntax error after: '10 '")
  })
})
