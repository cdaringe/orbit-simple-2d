(function (undefined) {
"use strict";

var root = this, exports = {};
var _ = require('underscore');
var Body = require('./orbit-body');

function Orbit(config) {
    var self = this;
    var nodeIds = [];
    if (config.debug) {
        window.orbitter = this;
    }
    if (!config) {
        throw new Error("no config passed to Orbit");
    }
    if (!config.id) {
        throw new Error("no canvas id passed to Orbit");
    }
    if (!config.speed) {
        throw new Error("no orbit speed specified");
    }
    if (!config.size) {
        config.size = [400, 400];
    }

    _.extend(this, config);

    this.el = window.document.getElementById(config.id);
    this.el.width = this.size[0];
    this.el.height = this.size[1];
    this.el.style.position = "relative";

    this.nodes = this.nodes || [];
    _.each(this.nodes, function createNodeIsolatedCanvas(node, key, arr) {
        // Initialize orbitter node core
        node.id = node.id || key;
        nodeIds.push(node.id);
        node.parent = self;
        node.timeToOrbit = node.timeToOrbit || self.timeToOrbit;
        node.timeToHome = node.timeToHome || self.timeToHome || node.timeToOrbit;
        node.speed = node.speed || node.parent.speed;
        node.canvas = window.document.createElement('canvas');
        node.canvas.width = self.el.width;
        node.canvas.height = self.el.height;
        node.canvas.style.position = "absolute";
        node.canvas.style.left = 0;
        node.canvas.id = 'orbit_simple_canvas_' + window.encodeURIComponent(node.id);
        node.ctx = node.canvas.getContext("2d");
        arr[key] = node = Body.extend(node);
        self.el.appendChild(node.canvas);
        node.draw();
    });

    // Ensure node ids unique
    if (nodeIds.length !== _.unique(nodeIds).length) {
        throw new Error('Duplicate node IDs detected');
    }
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

// attach to window or export with commonJS
exports.Orbit = Orbit;
if (typeof module !== "undefined" && !mocha) {
    module.exports = exports;
} else if (typeof define === "function" && define.amd) {
    define(exports);
} else {
    window.Orbit = Orbit;
}

})();