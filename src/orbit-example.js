(function(){
"use strict";
var Orbit = require('./orbit-simple-2d');
var domready = require('domready');

domready(function () {
    var orbitter = new Orbit({
        debug: true,
        id: "orbitter",
        size: [400, 400],
        speed: {
            t: 30                   // rpm
        },
        timeToOrbit: 1000,          // time to orbit radius & theta alignment, ms (not really a sp)
        timeToHome: 8000,
        nodes: [
            {
                id: 1,
                pos: {              // initial position!
                    r: 50,          // radial, px
                    t: Math.PI/4    // theta, radians
                },
                orbitPos: {         // initial position at orbit
                    r: 100,         // radial, px
                    t: Math.PI/1.1  // theta *offset* from theta position, radians
                },
                speed: {
                    t: 4            // theta, rpm (overrides default from above)
                },
                style: {
                    radius: 15,
                    color: 'red'
                },
                dir: 1              // 1/-1, cw/ccw
            } , {
                id: 2,
                pos :{
                    r: 0,
                    t: Math.PI
                },
                orbitPos: {      // position at orbit
                    r: 150,
                    t: 3*Math.PI/2 // theta in reference to other nodes at same speed
                },
                style: {
                    radius: 30,
                    color: 'green'
                }
            }, {
                id: 3,
                pos :{
                    r: 0,
                    t: Math.PI
                },
                orbitPos: {
                    r: 30,
                    t: Math.PI
                },
                style: {
                    radius: 20,
                    color: 'pink'
                }
            }, {
                id: 4,
                pos :{
                    r: 0,
                    t: Math.PI
                },
                orbitPos: {
                    r: 70,
                    t: 2*Math.PI/3
                },
                style: {
                    radius: 20,
                    color: 'blue'
                }
            }, {
                id: 5,
                pos :{
                    r: 80,
                    t: Math.PI/4
                },
                orbitPos: {
                    r: 90,
                    t: Math.PI/4
                },
                style: {
                    radius: 8,
                    color: 'chocolate'
                }
            },
            {
                id: 6,
                pos :{
                    r: 100,
                    t: Math.PI/4
                },
                orbitPos: {
                    r: 90,
                    t: Math.PI/4 + 0.3
                },
                style: {
                    radius: 8,
                    color: 'coral'
                }
            }
        ]
    });

    // orbit all nodes!
    orbitter.orbitAll();

    // home them after 4s (+timeToOrbit to return home)
    setTimeout(function homeNodes(){
        orbitter.homeAll();
    }, 4000);
});

})();