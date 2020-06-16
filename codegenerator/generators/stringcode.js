goog.provide('Blockly.SC');
goog.require('Blockly.Generator');
goog.require('Blockly.utils.string');

Blockly.SC = new Blockly.Generator('SC');

Blockly.SC.addReservedWords('ADD,AND,CONCAT,DIV,ENDSWITH,EQ,GTEQ,GT,IF,LTEQ,LT,MUL,NE,NOT,STARTSWITH,JOIN,OR,MOD');

Blockly.SC.ORDER_ATOMIC = 0;             // 0 "" ...
Blockly.SC.ORDER_CLONE = 1;              // clone
Blockly.SC.ORDER_NEW = 1;                // new
Blockly.SC.ORDER_MEMBER = 2.1;           // []
Blockly.SC.ORDER_FUNCTION_CALL = 2.2;    // ()
Blockly.SC.ORDER_POWER = 3;              // **
Blockly.SC.ORDER_INCREMENT = 4;          // ++
Blockly.SC.ORDER_DECREMENT = 4;          // --
Blockly.SC.ORDER_BITWISE_NOT = 4;        // ~
Blockly.SC.ORDER_CAST = 4;               // (int) (float) (string) (array) ...
Blockly.SC.ORDER_SUPPRESS_ERROR = 4;     // @
Blockly.SC.ORDER_INSTANCEOF = 5;         // instanceof
Blockly.SC.ORDER_LOGICAL_NOT = 6;        // !
Blockly.SC.ORDER_UNARY_PLUS = 7.1;       // +
Blockly.SC.ORDER_UNARY_NEGATION = 7.2;   // -
Blockly.SC.ORDER_MULTIPLICATION = 8.1;   // *
Blockly.SC.ORDER_DIVISION = 8.2;         // /
Blockly.SC.ORDER_MODULUS = 8.3;          // %
Blockly.SC.ORDER_ADDITION = 9.1;         // +
Blockly.SC.ORDER_SUBTRACTION = 9.2;      // -
Blockly.SC.ORDER_STRING_CONCAT = 9.3;    // .
Blockly.SC.ORDER_BITWISE_SHIFT = 10;     // << >>
Blockly.SC.ORDER_RELATIONAL = 11;        // < <= > >=
Blockly.SC.ORDER_EQUALITY = 12;          // == != === !== <> <=>
Blockly.SC.ORDER_REFERENCE = 13;         // &
Blockly.SC.ORDER_BITWISE_AND = 13;       // &
Blockly.SC.ORDER_BITWISE_XOR = 14;       // ^
Blockly.SC.ORDER_BITWISE_OR = 15;        // |
Blockly.SC.ORDER_LOGICAL_AND = 16;       // &&
Blockly.SC.ORDER_LOGICAL_OR = 17;        // ||
Blockly.SC.ORDER_IF_NULL = 18;           // ??
Blockly.SC.ORDER_CONDITIONAL = 19;       // ?:
Blockly.SC.ORDER_ASSIGNMENT = 20;        // = += -= *= /= %= <<= >>= ...
Blockly.SC.ORDER_LOGICAL_AND_WEAK = 21;  // and
Blockly.SC.ORDER_LOGICAL_XOR = 22;       // xor
Blockly.SC.ORDER_LOGICAL_OR_WEAK = 23;   // or
Blockly.SC.ORDER_COMMA = 24;             // ,
Blockly.SC.ORDER_NONE = 99;              // (...)

/**
 * List of outer-inner pairings that do NOT require parentheses.
 * @type {!Array.<!Array.<number>>}
 */
Blockly.SC.ORDER_OVERRIDES = [
  // (foo()).bar() -> foo().bar()
  // (foo())[0] -> foo()[0]
  [Blockly.SC.ORDER_MEMBER, Blockly.SC.ORDER_FUNCTION_CALL],
  // (foo[0])[1] -> foo[0][1]
  // (foo.bar).baz -> foo.bar.baz
  [Blockly.SC.ORDER_MEMBER, Blockly.SC.ORDER_MEMBER],
  // !(!foo) -> !!foo
  [Blockly.SC.ORDER_LOGICAL_NOT, Blockly.SC.ORDER_LOGICAL_NOT],
  // a * (b * c) -> a * b * c
  [Blockly.SC.ORDER_MULTIPLICATION, Blockly.SC.ORDER_MULTIPLICATION],
  // a + (b + c) -> a + b + c
  [Blockly.SC.ORDER_ADDITION, Blockly.SC.ORDER_ADDITION],
  // a && (b && c) -> a && b && c
  [Blockly.SC.ORDER_LOGICAL_AND, Blockly.SC.ORDER_LOGICAL_AND],
  // a || (b || c) -> a || b || c
  [Blockly.SC.ORDER_LOGICAL_OR, Blockly.SC.ORDER_LOGICAL_OR]
];

Blockly.SC.init = function(workspace) {
  Blockly.SC.definitions_ = Object.create(null);
  Blockly.SC.functionNames_ = Object.create(null);

  if (!Blockly.SC.variableDB_) {
    Blockly.SC.variableDB_ =
      new Blockly.Names(Blockly.SC.RESERVED_WORDS_,'');
  } else {
    Blockly.SC.variableDB_.reset();
  }

  Blockly.SC.variableDB_.setVariableMap(workspace.getVariableMap());

  var defvars = [];

  var devVarList = Blockly.Variables.allDeveloperVariables(workspace);
  for (var i = 0; i < devVarList.length; i++) {
    defvars.push(Blockly.SC.variableDB_.getName(devVarList[i],
      Blockly.Names.DEVELOPER_VARIABLE_TYPE) + ';');
  }

  var variables = Blockly.Variables.allUsedVarModels(workspace);
  for (var i = 0; variable; variable = variables[i]; i++) {
    defvars.push(Blockly.SC.variableDB_.getName(variable.getId(),
      Blockly.VARIABLE_CATEGORY_NAME) + ';');
  }

  Blockly.SC.definitions_['variables'] = defvars.join('\n');
};


Blockly.SC.finish = function(code) {
  var definitions = [];
  for (var name in Blockly.SC.definitions_) {
    definitions.push(Blockly.SC.definitions_[name]);
  }
  delete Blockly.SC.definitions_;
  delete Blockly.SC.functionNames_;
  Blockly.SC.variableDB_.reset();
  return definitions.join('\n\n') + '\n\n\n' + code;
};

Blockly.SC.scrubNakedValue = function(line) {
  return line + ';\n';
};

Blockly.SC.quote_ = function(string) {
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Encode a string as a properly escaped multiline SC string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} SC string.
 * @private
 */
Blockly.SC.multiline_quote_ = function(string) {
  return '<<<EOT\n' + string + '\nEOT';
};

/**
 * Common tasks for generating SC from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The SC code created for this block.
 * @param {boolean=} opt_thisOnly True to generate code for only this statement.
 * @return {string} SC code with comments and subsequent blocks added.
 * @private
 */
Blockly.SC.scrub_ = function(block, code, opt_thisOnly) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      comment = Blockly.utils.string.wrap(comment,
          Blockly.SC.COMMENT_WRAP - 3);
      commentCode += Blockly.SC.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          comment = Blockly.SC.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.SC.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = opt_thisOnly ? '' : Blockly.SC.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @return {string|number}
 */
Blockly.SC.getAdjusted = function(block, atId, opt_delta, opt_negate,
    opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || Blockly.SC.ORDER_NONE;
  if (block.workspace.options.oneBasedIndex) {
    delta--;
  }
  var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
  if (delta > 0) {
    var at = Blockly.SC.valueToCode(block, atId,
            Blockly.SC.ORDER_ADDITION) || defaultAtIndex;
  } else if (delta < 0) {
    var at = Blockly.SC.valueToCode(block, atId,
            Blockly.SC.ORDER_SUBTRACTION) || defaultAtIndex;
  } else if (opt_negate) {
    var at = Blockly.SC.valueToCode(block, atId,
            Blockly.SC.ORDER_UNARY_NEGATION) || defaultAtIndex;
  } else {
    var at = Blockly.SC.valueToCode(block, atId, order) ||
        defaultAtIndex;
  }

  if (Blockly.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = Number(at) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = at + ' + ' + delta;
      var innerOrder = Blockly.SC.ORDER_ADDITION;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = Blockly.SC.ORDER_SUBTRACTION;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = Blockly.SC.ORDER_UNARY_NEGATION;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};
