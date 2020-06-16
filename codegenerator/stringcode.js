Blockly.SC = new Blockly.Generator("SC");
Blockly.SC.addReservedWords("ADD,AND,CONCAT,DIV,ENDSWITH,EQ,GTEQ,GT,IF,LTEQ,LT,MUL,NE,NOT,STARTSWITH,JOIN,OR,MOD,VAR," + Object.getOwnPropertyNames(Blockly.utils.global).join(","));
Blockly.SC.ORDER_ATOMIC = 0;
Blockly.SC.ORDER_NEW = 1.1;
Blockly.SC.ORDER_MEMBER = 1.2;
Blockly.SC.ORDER_FUNCTION_CALL = 2;
Blockly.SC.ORDER_INCREMENT = 3;
Blockly.SC.ORDER_DECREMENT = 3;
Blockly.SC.ORDER_BITWISE_NOT = 4.1;
Blockly.SC.ORDER_UNARY_PLUS = 4.2;
Blockly.SC.ORDER_UNARY_NEGATION = 4.3;
Blockly.SC.ORDER_LOGICAL_NOT = 4.4;
Blockly.SC.ORDER_TYPEOF = 4.5;
Blockly.SC.ORDER_VOID = 4.6;
Blockly.SC.ORDER_DELETE = 4.7;
Blockly.SC.ORDER_AWAIT = 4.8;
Blockly.SC.ORDER_EXPONENTIATION = 5;
Blockly.SC.ORDER_MULTIPLICATION = 5.1;
Blockly.SC.ORDER_DIVISION = 5.2;
Blockly.SC.ORDER_MODULUS = 5.3;
Blockly.SC.ORDER_SUBTRACTION = 6.1;
Blockly.SC.ORDER_ADDITION = 6.2;
Blockly.SC.ORDER_BITWISE_SHIFT = 7;
Blockly.SC.ORDER_RELATIONAL = 8;
Blockly.SC.ORDER_IN = 8;
Blockly.SC.ORDER_INSTANCEOF = 8;
Blockly.SC.ORDER_EQUALITY = 9;
Blockly.SC.ORDER_BITWISE_AND = 10;
Blockly.SC.ORDER_BITWISE_XOR = 11;
Blockly.SC.ORDER_BITWISE_OR = 12;
Blockly.SC.ORDER_LOGICAL_AND = 13;
Blockly.SC.ORDER_LOGICAL_OR = 14;
Blockly.SC.ORDER_CONDITIONAL = 15;
Blockly.SC.ORDER_ASSIGNMENT = 16;
Blockly.SC.ORDER_YIELD = 17;
Blockly.SC.ORDER_COMMA = 18;
Blockly.SC.ORDER_NONE = 99;
Blockly.SC.ORDER_OVERRIDES = [
    [Blockly.SC.ORDER_FUNCTION_CALL, Blockly.SC.ORDER_MEMBER],
    [Blockly.SC.ORDER_FUNCTION_CALL, Blockly.SC.ORDER_FUNCTION_CALL],
    [Blockly.SC.ORDER_MEMBER, Blockly.SC.ORDER_MEMBER],
    [Blockly.SC.ORDER_MEMBER, Blockly.SC.ORDER_FUNCTION_CALL],
    [Blockly.SC.ORDER_LOGICAL_NOT, Blockly.SC.ORDER_LOGICAL_NOT],
    [Blockly.SC.ORDER_MULTIPLICATION, Blockly.SC.ORDER_MULTIPLICATION],
    [Blockly.SC.ORDER_ADDITION,
        Blockly.SC.ORDER_ADDITION
    ],
    [Blockly.SC.ORDER_LOGICAL_AND, Blockly.SC.ORDER_LOGICAL_AND],
    [Blockly.SC.ORDER_LOGICAL_OR, Blockly.SC.ORDER_LOGICAL_OR]
];
Blockly.SC.init = function(a) {
    Blockly.SC.definitions_ = Object.create(null);
    Blockly.SC.functionNames_ = Object.create(null);
    Blockly.SC.variableDB_ ? Blockly.SC.variableDB_.reset() : Blockly.SC.variableDB_ = new Blockly.Names(Blockly.SC.RESERVED_WORDS_);
    Blockly.SC.variableDB_.setVariableMap(a.getVariableMap());
    for (var b = [], c = Blockly.Variables.allDeveloperVariables(a), d = 0; d < c.length; d++) b.push(Blockly.SC.variableDB_.getName(c[d], Blockly.Names.DEVELOPER_VARIABLE_TYPE));
    a = Blockly.Variables.allUsedVarModels(a);
    for (d = 0; d < a.length; d++) b.push(Blockly.SC.variableDB_.getName(a[d].getId(), Blockly.VARIABLE_CATEGORY_NAME));
    b.length && (Blockly.SC.definitions_.variables = "var " + b.join(", ") + ";")
};
Blockly.SC.finish = function(a) {
    var b = [],
        c;
    for (c in Blockly.SC.definitions_) b.push(Blockly.SC.definitions_[c]);
    delete Blockly.SC.definitions_;
    delete Blockly.SC.functionNames_;
    Blockly.SC.variableDB_.reset();
    return b.join("\n\n") + "\n\n\n" + a
};
Blockly.SC.scrubNakedValue = function(a) {
    return a;
};
Blockly.SC.quote_ = function(a) {
    a = a.replace(/\\/g, "\\\\").replace(/\n/g, "\\\n").replace(/'/g, "\\'");
    return "'" + a + "'"
};
Blockly.SC.scrub_ = function(a, b, c) {
    var d = "";
    if (!a.outputConnection || !a.outputConnection.targetConnection) {
        var e = a.getCommentText();
        e && (e = Blockly.utils.string.wrap(e, Blockly.SC.COMMENT_WRAP - 3), d += Blockly.SC.prefixLines(e + "\n", "// "));
        for (var f = 0; f < a.inputList.length; f++) a.inputList[f].type == Blockly.INPUT_VALUE && (e = a.inputList[f].connection.targetBlock()) && (e = Blockly.SC.allNestedComments(e)) && (d += Blockly.SC.prefixLines(e, "// "))
    }
    a = a.nextConnection && a.nextConnection.targetBlock();
    c = c ? "" : Blockly.SC.blockToCode(a);
    return d + b + c
};
Blockly.SC.getAdjusted = function(a, b, c, d, e) {
    c = c || 0;
    e = e || Blockly.SC.ORDER_NONE;
    a.workspace.options.oneBasedIndex && c--;
    var f = a.workspace.options.oneBasedIndex ? "1" : "0";
    a = 0 < c ? Blockly.SC.valueToCode(a, b, Blockly.SC.ORDER_ADDITION) || f : 0 > c ? Blockly.SC.valueToCode(a, b, Blockly.SC.ORDER_SUBTRACTION) || f : d ? Blockly.SC.valueToCode(a, b, Blockly.SC.ORDER_UNARY_NEGATION) || f : Blockly.SC.valueToCode(a, b, e) || f;
    if (Blockly.isNumber(a)) a = Number(a) + c, d &&
        (a = -a);
    else {
        if (0 < c) {
            a = a + " + " + c;
            var g = Blockly.SC.ORDER_ADDITION
        } else 0 > c && (a = a + " - " + -c, g = Blockly.SC.ORDER_SUBTRACTION);
        d && (a = c ? "-(" + a + ")" : "-" + a, g = Blockly.SC.ORDER_UNARY_NEGATION);
        g = Math.floor(g);
        e = Math.floor(e);
        g && e >= g && (a = "(" + a + ")")
    }
    return a
};
//------------------Logic---------------------
Blockly.SC.logic = {};

Blockly.SC.controls_if = function(a) {
    var b = 0,
        c = "";
    Blockly.SC.STATEMENT_PREFIX && (c += Blockly.SC.injectId(Blockly.SC.STATEMENT_PREFIX, a));
    do {
        var d = Blockly.SC.valueToCode(a, "IF" + b, Blockly.SC.ORDER_NONE) || "false";
        var e = Blockly.SC.statementToCode(a, "DO" + b);
        Blockly.SC.STATEMENT_SUFFIX && (e = Blockly.SC.prefixLines(Blockly.SC.injectId(Blockly.SC.STATEMENT_SUFFIX, a), Blockly.SC.INDENT) + e);
        c += (0 < b ? " else " : "") + "IF(" + d + ","+e;
        ++b
    } while (a.getInput("IF" + b));
    if (a.getInput("ELSE") || Blockly.SC.STATEMENT_SUFFIX) e = Blockly.SC.statementToCode(a, "ELSE"), Blockly.SC.STATEMENT_SUFFIX && (e = Blockly.SC.prefixLines(Blockly.SC.injectId(Blockly.SC.STATEMENT_SUFFIX, a), Blockly.SC.INDENT) + e), c += "," + e;
    return c+")";
};

Blockly.SC.controls_ifelse = Blockly.SC.controls_if;

Blockly.SC.logic_compare = function(a) {
    var b = {
            EQ: "==",
            NEQ: "!=",
            LT: "<",
            LTE: "<=",
            GT: ">",
            GTE: ">="
        } [a.getFieldValue("OP")],
        c = "==" == b || "!=" == b ? Blockly.SC.ORDER_EQUALITY : Blockly.SC.ORDER_RELATIONAL,
        d = Blockly.SC.valueToCode(a, "A", c) || "0";
    a = Blockly.SC.valueToCode(a, "B", c) || "0";
    return [d + " " + b + " " + a, c]
};
Blockly.SC.logic_operation = function(a) {
    var b = "AND" == a.getFieldValue("OP") ? "&&" : "||",
        c = "&&" == b ? Blockly.SC.ORDER_LOGICAL_AND : Blockly.SC.ORDER_LOGICAL_OR,
        d = Blockly.SC.valueToCode(a, "A", c);
    a = Blockly.SC.valueToCode(a, "B", c);
    if (d || a) {
        var e = "&&" == b ? "true" : "false";
        d || (d = e);
        a || (a = e)
    } else a = d = "false";
    return [d + " " + b + " " + a, c]
};

Blockly.SC.logic_negate = function(a) {
    var b = Blockly.SC.ORDER_LOGICAL_NOT;
    var value = Blockly.SC.valueToCode(a, "BOOL", b);//(Blockly.SC.valueToCode(a, "BOOL", b) || "true");
    if (value.includes("(") && value.includes(")"))
      return ["NOT" + value, b]
    return ["NOT(" + value+")", b]
};
Blockly.SC.logic_boolean = function(a) {
    return ["TRUE" == a.getFieldValue("BOOL") ? "true" : "false", Blockly.SC.ORDER_ATOMIC]
};
Blockly.SC.input_true = function(a) {
  return ["TRUE()",Blockly.SC.ORDER_ATOMIC];
}

//------------------Math---------------------
Blockly.SC.math = {};
Blockly.SC.math_number = function(a) {
    a = Number(a.getFieldValue("NUM"));
    return [a, 0 <= a ? Blockly.SC.ORDER_ATOMIC : Blockly.SC.ORDER_UNARY_NEGATION]
};
Blockly.SC.math_arithmetic = function(a) {
    var b = {
            ADD: ["ADD(", Blockly.SC.ORDER_ADDITION],
            MULTIPLY: ["MUL(", Blockly.SC.ORDER_MULTIPLICATION],
            DIVIDE: ["DIV(", Blockly.SC.ORDER_DIVISION]
        } [a.getFieldValue("OP")],
        c = b[0];
    b = b[1];
    var d = Blockly.SC.valueToCode(a, "A", b) || "0";
    a = Blockly.SC.valueToCode(a, "B", b) || "0";
    return c ? [c + d +","+ a+")", b] : ["Math.pow(" + d + ", " + a + ")", Blockly.SC.ORDER_FUNCTION_CALL]
};
Blockly.SC.math_modulo = function(a) {
    var b = Blockly.SC.valueToCode(a, "DIVIDEND", Blockly.SC.ORDER_MODULUS) || "0";
    a = Blockly.SC.valueToCode(a, "DIVISOR", Blockly.SC.ORDER_MODULUS) || "0";
    return ["MOD("+b + ", " + a+") ", Blockly.SC.ORDER_MODULUS]
};
//------------------Checks---------------------
Blockly.SC.checks = {};
Blockly.SC.check_startswith = function(a) {
  var text = Blockly.SC.valueToCode(a, "TEXT", Blockly.SC.ORDER_NONE)
  var text2 = a.getFieldValue("VAR");
  if (text2.includes(",")) {
    var text2array = text2.split(",");
    var newtext2 = "'"+text2array[0]+"'";

    for (var i = 1; i < text2array.length; i++) {
      newtext2 += ",'"+text2array[i]+"'";
    }

    return ["STARTSWITH("+text+", "+newtext2+") ", Blockly.SC.ORDER_NONE];
  }

  return ["STARTSWITH("+text+", '"+text2+"') ", Blockly.SC.ORDER_NONE];
};
Blockly.SC.check_endswith = function(a) {
  var text = Blockly.SC.valueToCode(a, "TEXT", Blockly.SC.ORDER_NONE)
  var text2 = a.getFieldValue("VAR");
  if (text2.includes(",")) {
    var text2array = text2.split(",");
    var newtext2 = "'"+text2array[0]+"'";

    for (var i = 1; i < text2array.length; i++) {
      newtext2 += ",'"+text2array[i]+"'";
    }

    return ["ENDSWITH("+text+", "+newtext2+") ", Blockly.SC.ORDER_NONE];
  }

  return ["ENDSWITH("+text+", '"+text2+"') ", Blockly.SC.ORDER_NONE];
};
Blockly.SC.check_equals = function(a) {
  var text = Blockly.SC.valueToCode(a, "VAR1", Blockly.SC.ORDER_NONE)
  var text2 = Blockly.SC.valueToCode(a, "VAR2", Blockly.SC.ORDER_NONE)

  return ["EQ("+text+","+text2+") ", Blockly.SC.ORDER_NONE];
};
Blockly.SC.check_notequals = function(a) {
  var text = Blockly.SC.valueToCode(a, "VAR1", Blockly.SC.ORDER_NONE)
  var text2 = Blockly.SC.valueToCode(a, "VAR2", Blockly.SC.ORDER_NONE)

  return ["NE("+text+","+text2+") ", Blockly.SC.ORDER_NONE]
};
Blockly.SC.check_greater = function(a) {
  var text = Blockly.SC.valueToCode(a, "VAR", Blockly.SC.ORDER_NONE)
  var text2 = Blockly.SC.valueToCode(a, "CHECK", Blockly.SC.ORDER_NONE)

  return ["GT("+text+","+text2+") ", Blockly.SC.ORDER_NONE]
};
Blockly.SC.check_greatereq = function(a) {
  var text = Blockly.SC.valueToCode(a, "VAR", Blockly.SC.ORDER_NONE)
  var text2 = Blockly.SC.valueToCode(a, "CHECK", Blockly.SC.ORDER_NONE)

  return ["GTEQ("+text+","+text2+") ", Blockly.SC.ORDER_NONE]
};
Blockly.SC.check_less = function(a) {
  var text = Blockly.SC.valueToCode(a, "VAR", Blockly.SC.ORDER_NONE)
  var text2 = Blockly.SC.valueToCode(a, "CHECK", Blockly.SC.ORDER_NONE)

  return ["LT("+text+","+text2+") ", Blockly.SC.ORDER_NONE]
};
Blockly.SC.check_lesseq = function(a) {
  var text = Blockly.SC.valueToCode(a, "VAR", Blockly.SC.ORDER_NONE)
  var text2 = Blockly.SC.valueToCode(a, "CHECK", Blockly.SC.ORDER_NONE)

  return ["LTEQ("+text+","+text2+") ", Blockly.SC.ORDER_NONE]
};
Blockly.SC.check_equals = function(a) {
  var text = Blockly.SC.valueToCode(a, "VAR1", Blockly.SC.ORDER_NONE)
  var text2 = Blockly.SC.valueToCode(a, "VAR2", Blockly.SC.ORDER_NONE)

  return ["EQ("+text+","+text2+") ", Blockly.SC.ORDER_NONE]
};
//------------------Texts---------------------
Blockly.SC.texts = {};
Blockly.SC.text = function(a) {
    return [Blockly.SC.quote_(a.getFieldValue("TEXT")), Blockly.SC.ORDER_ATOMIC];
};
Blockly.SC.input_parameter = function(a) {
    return [a.getFieldValue("TEXT"), Blockly.SC.ORDER_NONE];
};
Blockly.SC.input_empty = function(a) {
    return ["''", Blockly.SC.ORDER_NONE]
};
Blockly.SC.text_join = function(a) {
    switch (a.itemCount_) {
        case 0:
            return ["", Blockly.SC.ORDER_ATOMIC];
        case 1:
            return a = "CONCAT("+Blockly.SC.valueToCode(a, "ADD0", Blockly.SC.ORDER_NONE) || "''", a = Blockly.SC.text.forceString_(a)+")", [a, Blockly.SC.ORDER_FUNCTION_CALL];
        default:
            b = Array(a.itemCount_);
            for (var c = 0; c < a.itemCount_; c++) b[c] = Blockly.SC.valueToCode(a, "ADD" + c, Blockly.SC.ORDER_COMMA) || "''";
            a = "CONCAT(" + b.join(",") + ") ";
            return [a, Blockly.SC.ORDER_FUNCTION_CALL]
    }
};
Blockly.SC.text_print = function(a) {
    return Blockly.SC.valueToCode(a, "TEXT", Blockly.SC.ORDER_NONE);
};
//------------------Variables---------------------
Blockly.SC.variables = {};
Blockly.SC.variables_get = function(a) {
    return [Blockly.SC.variableDB_.getName(a.getFieldValue("VAR"), Blockly.VARIABLE_CATEGORY_NAME), Blockly.SC.ORDER_ATOMIC]
};
Blockly.SC.variables_set = function(a) {
    var b = Blockly.SC.valueToCode(a, "VALUE", Blockly.SC.ORDER_ASSIGNMENT) || "0";
    return Blockly.SC.variableDB_.getName(a.getFieldValue("VAR"), Blockly.VARIABLE_CATEGORY_NAME) + " = " + b + ";\n"
};
Blockly.SC.variablesDynamic = {};
Blockly.SC.variables_get_dynamic = Blockly.SC.variables_get;
Blockly.SC.variables_set_dynamic = Blockly.SC.variables_set;
