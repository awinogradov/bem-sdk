'use strict';

const origin = require('./origin');

module.exports = {
    ...origin,
    delims: {
        elem: '__',
        mod: { name: '--', val: '_' }
    }
};
