Blockly.Blocks['input_true'] = {
  init: function() {
    this.jsonInit({
      "message0": 'TRUE',
      "output": "Boolean",
      "colour": 200,
      "tooltip": "Returns true."
    });
  }
}
Blockly.Blocks['input_empty'] = {
  init: function() {
    this.jsonInit({
      "message0": 'EMPTY',
      "output": "String",
      "colour": 200,
      "tooltip": "Returns empty value."
    });
  }
}
Blockly.Blocks['check_endswith'] = {
  init: function() {
    this.jsonInit({
      "message0": '%2 ends with %1',
      "args0": [
        {
          "type": "field_input",
          "name": "VAR",
          "tooltip": "You can add multiple, just seperate them with \",\" . Ex. a,b,c ",
          "check": "String"
        },
        {
          "type": "input_value",
          "name": "TEXT",
          "tooltip": "String to test",
          "check": "String"
        }
      ],
      "output": "Boolean",
      "colour": 200,
      "tooltip": "Returns true, if the first parameter ends with any of the following parameters"
    });
  }
};
Blockly.Blocks['check_startswith'] = {
  init: function() {
    this.jsonInit({
      "message0": '%2 starts with %1',
      "args0": [
        {
          "type": "field_input",
          "name": "VAR",
          "tooltip": "You can add multiple, just seperate them with \",\" . Ex. a,b,c ",
          "check": "String"
        },
        {
          "type": "input_value",
          "name": "TEXT",
          "tooltip": "String to test",
          "check": "String"
        }
      ],
      "output": "Boolean",
      "colour": 200,
      "tooltip": "Returns true if the first parameter starts with any of the following parameters"
    });
  }
};
Blockly.Blocks['check_equals'] = {
  init: function() {
    this.jsonInit({
      "message0": '%2 equals to %1',
      "args0": [
        {
          "type": "input_value",
          "name": "VAR2",
        },
        {
          "type": "input_value",
          "name": "VAR1",
        }
      ],
      "output": "Boolean",
      "colour": 200,
      "tooltip": "Returns true if the first and the second parameter match"
    });
  }
};
Blockly.Blocks['check_notequals'] = {
  init: function() {
    this.jsonInit({
      "message0": '%2 not equals to %1',
      "args0": [
        {
          "type": "input_value",
          "name": "VAR2",
        },
        {
          "type": "input_value",
          "name": "VAR1",
        }
      ],
      "output": "Boolean",
      "colour": 200,
      "tooltip": "Returns true if the 2 objects are not equal"
    });
  }
};
Blockly.Blocks['functions_not'] = {
  init: function() {
    this.jsonInit({
      "message0": 'not %1',
      "args0": [
        {
          "type": "input_value",
          "name": "Input 1",
          "tooltip": "String to be added",
          "check": "Boolean"
        }
      ],
      "output": "Boolean",
      "colour": 200,
      "tooltip": "Returns the opposite value of the input. Ex. In case of true it will return false."
    });
  }
};
Blockly.Blocks['input_parameter'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Parameter %1 \'s value',
      "args0": [
        {
          "type": "field_input",
          "name": "TEXT",
          "tooltip": "The parameters name",
          "check": "String"
        }
      ],
      "output": ["String","Number"],
      "colour": 250,
      "tooltip": "Returns a parameter name."
    });
  }
};
Blockly.Blocks['check_greater'] = {
  init: function() {
    this.jsonInit({
      "message0": '%2 greater than %1',
      "args0": [
        {
          "type": "input_value",
          "name": "CHECK",
          "check": "Number"
        },
        {
          "type": "input_value",
          "name": "VAR",
          "check": "Number"
        }
      ],
      "output": "Boolean",
      "colour": 200,
      "tooltip": "Returns true if the first parameter is greater than the second"
    });
  }
};
Blockly.Blocks['check_greatereq'] = {
  init: function() {
    this.jsonInit({
      "message0": '%2 greater than or equals with %1',
      "args0": [
        {
          "type": "input_value",
          "name": "CHECK",
          "check": "Number"
        },
        {
          "type": "input_value",
          "name": "VAR",
          "check": "Number"
        }
      ],
      "output": "Boolean",
      "colour": 200,
      "tooltip": "Returns true if the first parameter is greater than or equal to the second"
    });
  }
};
Blockly.Blocks['check_less'] = {
  init: function() {
    this.jsonInit({
      "message0": '%2 less than %1',
      "args0": [
        {
          "type": "input_value",
          "name": "CHECK",
          "check": "Number"
        },
        {
          "type": "input_value",
          "name": "VAR",
          "check": "Number"
        }
      ],
      "output": "Boolean",
      "colour": 200,
      "tooltip": "Returns true if the first parameter is less than the second"
    });
  }
};
Blockly.Blocks['check_lesseq'] = {
  init: function() {
    this.jsonInit({
      "message0": '%2 less than or equals with %1',
      "args0": [
        {
          "type": "input_value",
          "name": "CHECK",
          "check": "Number"
        },
        {
          "type": "input_value",
          "name": "VAR",
          "check": "Number"
        }
      ],
      "output": "Boolean",
      "colour": 200,
      "tooltip": "Returns true if the first parameter is less than or equal to the second"
    });
  }
};
Blockly.Blocks['math_arithmetic'] = {
  init: function() {
    this.jsonInit({
      "type": "math_arithmetic",
      "message0": "%1 %2 %3",
      "args0": [
        {
          "type": "input_value",
          "name": "A",
          "check": "Number"
        },
        {
          "type": "field_dropdown",
          "name": "OP",
          "options": [
            ["%{BKY_MATH_ADDITION_SYMBOL}", "ADD"],
            ["%{BKY_MATH_SUBTRACTION_SYMBOL}", "MINUS"],
            ["%{BKY_MATH_MULTIPLICATION_SYMBOL}", "MULTIPLY"],
            ["%{BKY_MATH_DIVISION_SYMBOL}", "DIVIDE"],
            ["%{BKY_MATH_POWER_SYMBOL}", "POWER"]
          ]
        },
        {
          "type": "input_value",
          "name": "B",
          "check": "Number"
        }
      ],
      "inputsInline": true,
      "output": "Number",
      "style": "math_blocks",
      "extensions": ["math_op_tooltip"]

    });
  }
};
