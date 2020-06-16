'use strict';

goog.provide('Blockly.SC.logic');

goog.require('Blockly.SC');


Blockly.SC['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  if (Blockly.SC.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.SC.injectId(Blockly.SC.STATEMENT_PREFIX, block);
  }
  do {
    conditionCode = Blockly.SC.valueToCode(block, 'IF' + n,
        Blockly.SC.ORDER_NONE) || 'false';
    branchCode = Blockly.SC.statementToCode(block, 'DO' + n);
    if (Blockly.SC.STATEMENT_SUFFIX) {
      branchCode = Blockly.SC.prefixLines(
          Blockly.SC.injectId(Blockly.SC.STATEMENT_SUFFIX, block),
          Blockly.SC.INDENT) + branchCode;
    }
    code += (n > 0 ? ' else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';
    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE') || Blockly.SC.STATEMENT_SUFFIX) {
    branchCode = Blockly.SC.statementToCode(block, 'ELSE');
    if (Blockly.SC.STATEMENT_SUFFIX) {
      branchCode = Blockly.SC.prefixLines(
          Blockly.SC.injectId(Blockly.SC.STATEMENT_SUFFIX, block),
          Blockly.SC.INDENT) + branchCode;
    }
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.SC['controls_ifelse'] = Blockly.SC['controls_if'];

Blockly.SC['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.SC.ORDER_EQUALITY : Blockly.SC.ORDER_RELATIONAL;
  var argument0 = Blockly.SC.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.SC.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.SC['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.SC.ORDER_LOGICAL_AND :
      Blockly.SC.ORDER_LOGICAL_OR;
  var argument0 = Blockly.SC.valueToCode(block, 'A', order);
  var argument1 = Blockly.SC.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.SC['logic_negate'] = function(block) {
  // Negation.
  var order = Blockly.SC.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.SC.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.SC['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.SC.ORDER_ATOMIC];
};

Blockly.SC['logic_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.SC.ORDER_ATOMIC];
};

Blockly.SC['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.SC.valueToCode(block, 'IF',
      Blockly.SC.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.SC.valueToCode(block, 'THEN',
      Blockly.SC.ORDER_CONDITIONAL) || 'null';
  var value_else = Blockly.SC.valueToCode(block, 'ELSE',
      Blockly.SC.ORDER_CONDITIONAL) || 'null';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.SC.ORDER_CONDITIONAL];
};
