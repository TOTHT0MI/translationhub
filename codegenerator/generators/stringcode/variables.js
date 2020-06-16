'use strict';

goog.provide('Blockly.SC.variables');

goog.require('Blockly.SC');


Blockly.SC['variables_get'] = function(block) {
    // Variable getter.
    var code = Blockly.SC.variableDB_.getName(block.getFieldValue('VAR'),
        Blockly.VARIABLE_CATEGORY_NAME);
    return [code, Blockly.SC.ORDER_ATOMIC];
};

Blockly.SC['variables_set'] = function(block) {
    // Variable setter.
    var argument0 = Blockly.SC.valueToCode(block, 'VALUE',
            Blockly.SC.ORDER_ASSIGNMENT) || '0';
    var varName = Blockly.SC.variableDB_.getName(
        block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME);
    return varName + ' = ' + argument0 + ';\n';
};
