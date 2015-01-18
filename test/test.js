"use strict";
var should = require('should');
var Orbit = require('../src/orbit-simple-2d');
var orbiter;

describe('orbit manager', function () {
    beforeEach(function() {
    });

    it('should accept config options', function () {
        (function(){ new Orbit(); }).should.throw;
        (function(){ new Orbit({}); }).should.throw;
        (function(){ new Orbit({id: 1}); }).should.be.ok;
    });
});

