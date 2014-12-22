(function(){
"use strict";
var Orbit = require('./orbit-simple-2d');
var domready = require('domready');

domready(function () {
    var orbitter = new Orbit({
        debug: true,
        id: "orbitter",
        size: [350, 350],
        speed: {
            t: 30                   // rpm
        },
        timeToOrbit: 1000,          // time to orbit radius & theta alignment, ms (not really a sp)
        nodes: [
            {
                id: 1,
                pos: {              // initial position!
                    r: 0,           // radial, px
                    t: 0            // theta, radians
                },
                orbitPos: {         // initial position at orbit
                    r: 150,         // radial, px
                    t: 0            // theta *offset* from theta position, radians
                },
                speed: {
                    t: 2            // theta, rpm (overrides default from above)
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
                    r: 40,
                    t: Math.PI/2 // theta in reference to other nodes at same speed
                },
                style: {
                    radius: 20,
                    color: 'green'
                }
            }, {
                id: 3,
                pos :{
                    r: 0,
                    t: Math.PI
                },
                orbitPos: {
                    r: 40,
                    t: Math.PI
                },
                style: {
                    radius: 20,
                    color: 'pink'
                }
            } ,{
                id: 4,
                pos :{
                    r: 0,
                    t: Math.PI
                },
                orbitPos: {
                    r: 100,
                    t: 2*Math.PI/3
                },
                style: {
                    radius: 20,
                    color: 'blue'
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