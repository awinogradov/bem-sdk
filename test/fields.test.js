'use strict';

const test = require('ava');
const naming = require('../index');

test('should have elemDelim field', t => {
    t.ok(naming.elemDelim);
});

test('should have modDelim field', t => {
    t.ok(naming.modDelim);
});

test('should create namespace with elemDelim field', t => {
    const myNaming = naming();

    t.ok(myNaming.elemDelim);
});

test('should create namespace with modDelim field', t => {
    const myNaming = naming();

    t.ok(myNaming.modDelim);
});
