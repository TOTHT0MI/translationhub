'use strict';

goog.provide('Blockly.SC.variablesDynamic');

goog.require('Blockly.SC');
goog.require('Blockly.SC.variables');


// SC is dynamically typed.
Blockly.SC['variables_get_dynamic'] = Blockly.SC['variables_get'];
Blockly.SC['variables_set_dynamic'] = Blockly.SC['variables_set'];
