'use strict';

goog.provide('Blockly.SC.texts');

goog.require('Blockly.SC');


Blockly.SC['text'] = function(block) {
  // Text value.
  var code = Blockly.SC.quote_(block.getFieldValue('TEXT'));
  return [code, Blockly.SC.ORDER_ATOMIC];
};

Blockly.SC['text_multiline'] = function(block) {
  // Text value.
  var code = Blockly.SC.multiline_quote_(block.getFieldValue('TEXT'));
  return [code, Blockly.SC.ORDER_ATOMIC];
};

Blockly.SC['text_join'] = function(block) {
  // Create a string made up of any number of elements of any type.
  if (block.itemCount_ == 0) {
    return ['\'\'', Blockly.SC.ORDER_ATOMIC];
  } else if (block.itemCount_ == 1) {
    var element = Blockly.SC.valueToCode(block, 'ADD0',
        Blockly.SC.ORDER_NONE) || '\'\'';
    var code = element;
    return [code, Blockly.SC.ORDER_FUNCTION_CALL];
  } else if (block.itemCount_ == 2) {
    var element0 = Blockly.SC.valueToCode(block, 'ADD0',
        Blockly.SC.ORDER_ATOMIC) || '\'\'';
    var element1 = Blockly.SC.valueToCode(block, 'ADD1',
        Blockly.SC.ORDER_ATOMIC) || '\'\'';
    var code = element0 + ' . ' + element1;
    return [code, Blockly.SC.ORDER_STRING_CONCAT];
  } else {
    var elements = new Array(block.itemCount_);
    for (var i = 0; i < block.itemCount_; i++) {
      elements[i] = Blockly.SC.valueToCode(block, 'ADD' + i,
          Blockly.SC.ORDER_COMMA) || '\'\'';
    }
    var code = 'implode(\'\', array(' + elements.join(',') + '))';
    return [code, Blockly.SC.ORDER_FUNCTION_CALL];
  }
};

Blockly.SC['text_append'] = function(block) {
  // Append to a variable in place.
  var varName = Blockly.SC.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
  var value = Blockly.SC.valueToCode(block, 'TEXT',
      Blockly.SC.ORDER_ASSIGNMENT) || '\'\'';
  return varName + ' .= ' + value + ';\n';
};

Blockly.SC['text_length'] = function(block) {
  // String or array length.
  var functionName = Blockly.SC.provideFunction_(
      'length',
      ['function ' + Blockly.SC.FUNCTION_NAME_PLACEHOLDER_ + '($value) {',
       '  if (is_string($value)) {',
       '    return strlen($value);',
       '  } else {',
       '    return count($value);',
       '  }',
       '}']);
  var text = Blockly.SC.valueToCode(block, 'VALUE',
      Blockly.SC.ORDER_NONE) || '\'\'';
  return [functionName + '(' + text + ')', Blockly.SC.ORDER_FUNCTION_CALL];
};

Blockly.SC['text_isEmpty'] = function(block) {
  // Is the string null or array empty?
  var text = Blockly.SC.valueToCode(block, 'VALUE',
      Blockly.SC.ORDER_NONE) || '\'\'';
  return ['empty(' + text + ')', Blockly.SC.ORDER_FUNCTION_CALL];
};

Blockly.SC['text_indexOf'] = function(block) {
  // Search the text for a substring.
  var operator = block.getFieldValue('END') == 'FIRST' ?
      'strpos' : 'strrpos';
  var substring = Blockly.SC.valueToCode(block, 'FIND',
      Blockly.SC.ORDER_NONE) || '\'\'';
  var text = Blockly.SC.valueToCode(block, 'VALUE',
      Blockly.SC.ORDER_NONE) || '\'\'';
  if (block.workspace.options.oneBasedIndex) {
    var errorIndex = ' 0';
    var indexAdjustment = ' + 1';
  } else {
    var errorIndex = ' -1';
    var indexAdjustment = '';
  }
  var functionName = Blockly.SC.provideFunction_(
      block.getFieldValue('END') == 'FIRST' ?
          'text_indexOf' : 'text_lastIndexOf',
      ['function ' + Blockly.SC.FUNCTION_NAME_PLACEHOLDER_ +
          '($text, $search) {',
       '  $pos = ' + operator + '($text, $search);',
       '  return $pos === false ? ' + errorIndex + ' : $pos' +
          indexAdjustment + ';',
       '}']);
  var code = functionName + '(' + text + ', ' + substring + ')';
  return [code, Blockly.SC.ORDER_FUNCTION_CALL];
};

Blockly.SC['text_charAt'] = function(block) {
  // Get letter at index.
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var textOrder = (where == 'RANDOM') ? Blockly.SC.ORDER_NONE :
      Blockly.SC.ORDER_COMMA;
  var text = Blockly.SC.valueToCode(block, 'VALUE', textOrder) || '\'\'';
  switch (where) {
    case 'FIRST':
      var code = 'substr(' + text + ', 0, 1)';
      return [code, Blockly.SC.ORDER_FUNCTION_CALL];
    case 'LAST':
      var code = 'substr(' + text + ', -1)';
      return [code, Blockly.SC.ORDER_FUNCTION_CALL];
    case 'FROM_START':
      var at = Blockly.SC.getAdjusted(block, 'AT');
      var code = 'substr(' + text + ', ' + at + ', 1)';
      return [code, Blockly.SC.ORDER_FUNCTION_CALL];
    case 'FROM_END':
      var at = Blockly.SC.getAdjusted(block, 'AT', 1, true);
      var code = 'substr(' + text + ', ' + at + ', 1)';
      return [code, Blockly.SC.ORDER_FUNCTION_CALL];
    case 'RANDOM':
      var functionName = Blockly.SC.provideFunction_(
          'text_random_letter',
          ['function ' + Blockly.SC.FUNCTION_NAME_PLACEHOLDER_ + '($text) {',
           '  return $text[rand(0, strlen($text) - 1)];',
           '}']);
      code = functionName + '(' + text + ')';
      return [code, Blockly.SC.ORDER_FUNCTION_CALL];
  }
  throw Error('Unhandled option (text_charAt).');
};

Blockly.SC['text_getSubstring'] = function(block) {
  // Get substring.
  var text = Blockly.SC.valueToCode(block, 'STRING',
      Blockly.SC.ORDER_FUNCTION_CALL) || '\'\'';
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  if (where1 == 'FIRST' && where2 == 'LAST') {
    var code = text;
  } else {
    var at1 = Blockly.SC.getAdjusted(block, 'AT1');
    var at2 = Blockly.SC.getAdjusted(block, 'AT2');
    var functionName = Blockly.SC.provideFunction_(
        'text_get_substring',
        ['function ' + Blockly.SC.FUNCTION_NAME_PLACEHOLDER_ +
            '($text, $where1, $at1, $where2, $at2) {',
         '  if ($where1 == \'FROM_END\') {',
         '    $at1 = strlen($text) - 1 - $at1;',
         '  } else if ($where1 == \'FIRST\') {',
         '    $at1 = 0;',
         '  } else if ($where1 != \'FROM_START\') {',
         '    throw new Exception(\'Unhandled option (text_get_substring).\');',
         '  }',
         '  $length = 0;',
         '  if ($where2 == \'FROM_START\') {',
         '    $length = $at2 - $at1 + 1;',
         '  } else if ($where2 == \'FROM_END\') {',
         '    $length = strlen($text) - $at1 - $at2;',
         '  } else if ($where2 == \'LAST\') {',
         '    $length = strlen($text) - $at1;',
         '  } else {',
         '    throw new Exception(\'Unhandled option (text_get_substring).\');',
         '  }',
         '  return substr($text, $at1, $length);',
         '}']);
    var code = functionName + '(' + text + ', \'' +
        where1 + '\', ' + at1 + ', \'' + where2 + '\', ' + at2 + ')';
  }
  return [code, Blockly.SC.ORDER_FUNCTION_CALL];
};

Blockly.SC['text_changeCase'] = function(block) {
  // Change capitalization.
  var text = Blockly.SC.valueToCode(block, 'TEXT',
          Blockly.SC.ORDER_NONE) || '\'\'';
  if (block.getFieldValue('CASE') == 'UPPERCASE') {
    var code = 'strtoupper(' + text + ')';
  } else if (block.getFieldValue('CASE') == 'LOWERCASE') {
    var code = 'strtolower(' + text + ')';
  } else if (block.getFieldValue('CASE') == 'TITLECASE') {
    var code = 'ucwords(strtolower(' + text + '))';
  }
  return [code, Blockly.SC.ORDER_FUNCTION_CALL];
};

Blockly.SC['text_trim'] = function(block) {
  // Trim spaces.
  var OPERATORS = {
    'LEFT': 'ltrim',
    'RIGHT': 'rtrim',
    'BOTH': 'trim'
  };
  var operator = OPERATORS[block.getFieldValue('MODE')];
  var text = Blockly.SC.valueToCode(block, 'TEXT',
      Blockly.SC.ORDER_NONE) || '\'\'';
  return [operator + '(' + text + ')', Blockly.SC.ORDER_FUNCTION_CALL];
};

Blockly.SC['text_print'] = function(block) {
  // Print statement.
  var msg = Blockly.SC.valueToCode(block, 'TEXT',
      Blockly.SC.ORDER_NONE) || '\'\'';
  return 'print(' + msg + ');\n';
};

Blockly.SC['text_prompt_ext'] = function(block) {
  // Prompt function.
  if (block.getField('TEXT')) {
    // Internal message.
    var msg = Blockly.SC.quote_(block.getFieldValue('TEXT'));
  } else {
    // External message.
    var msg = Blockly.SC.valueToCode(block, 'TEXT',
        Blockly.SC.ORDER_NONE) || '\'\'';
  }
  var code = 'readline(' + msg + ')';
  var toNumber = block.getFieldValue('TYPE') == 'NUMBER';
  if (toNumber) {
    code = 'floatval(' + code + ')';
  }
  return [code, Blockly.SC.ORDER_FUNCTION_CALL];
};

Blockly.SC['text_prompt'] = Blockly.SC['text_prompt_ext'];

Blockly.SC['text_count'] = function(block) {
  var text = Blockly.SC.valueToCode(block, 'TEXT',
      Blockly.SC.ORDER_MEMBER) || '\'\'';
  var sub = Blockly.SC.valueToCode(block, 'SUB',
      Blockly.SC.ORDER_NONE) || '\'\'';
  var code = 'strlen(' + sub + ') === 0'
    + ' ? strlen(' + text + ') + 1'
    + ' : substr_count(' + text + ', ' + sub + ')';
  return [code, Blockly.SC.ORDER_CONDITIONAL];
};

Blockly.SC['text_replace'] = function(block) {
  var text = Blockly.SC.valueToCode(block, 'TEXT',
      Blockly.SC.ORDER_MEMBER) || '\'\'';
  var from = Blockly.SC.valueToCode(block, 'FROM',
      Blockly.SC.ORDER_NONE) || '\'\'';
  var to = Blockly.SC.valueToCode(block, 'TO',
      Blockly.SC.ORDER_NONE) || '\'\'';
  var code = 'str_replace(' + from + ', ' + to + ', ' + text + ')';
  return [code, Blockly.SC.ORDER_FUNCTION_CALL];
};

Blockly.SC['text_reverse'] = function(block) {
  var text = Blockly.SC.valueToCode(block, 'TEXT',
      Blockly.SC.ORDER_MEMBER) || '\'\'';
  var code = 'strrev(' + text + ')';
  return [code, Blockly.SC.ORDER_FUNCTION_CALL];
};
