(function (undefined) {
"use strict";

var _ = require('underscore');
var Body = require('./orbit-body');

function Orbit(config) {
    var self = this;
    if (config.debug) {
        window.orbitter = this;
    }
    if (!config) {
        throw new Error("no config passed to Orbit");
    }
    if (!config.id) {
        throw new Error("no canvas id passed to Orbit");
    }
    _.extend(this, config);

    this.el = window.document.getElementById(config.id);
    this.el.width = this.size[0];
    this.el.height = this.size[1];
    this.el.style.position = "relative";

    _.each(this.nodes, function createNodeIsoCanvas(node, key, arr) {
        // Initialize orbitter node core
        node.id = node.id || key;
        node.parent = self;
        node.timeToOrbit = node.timeToOrbit || self.timeToOrbit;
        node.speed = node.speed || node.parent.speed;
        node.canvas = window.document.createElement('canvas');
        node.canvas.width = self.el.width;
        node.canvas.height = self.el.height;
        node.canvas.style.position = "absolute";
        node.canvas.style.left = 0;
        node.canvas.id = 'orbit_simple_canvas_' + node.id;
        node.ctx = node.canvas.getContext("2d");
        arr[key] = node = Body.extend(node);
        self.el.appendChild(node.canvas);
        node.draw();
    });

}

Orbit.prototype.homeAll = function() {
    _.each(this.nodes, function homeNode(node, key) {
        node.home();
    });
};

Orbit.prototype.orbitAll = function() {
    _.each(this.nodes, function orbitNode(node, key) {
        node.orbit();
    });
};


module.exports = Orbit;

})();