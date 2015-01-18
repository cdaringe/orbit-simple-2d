[ ![Codeship Status for cdaringe/orbit-simple-2d](https://codeship.com/projects/6b79a9b0-80d4-0132-31e9-364795131dd1/status?branch=master)](https://codeship.com/projects/57561)

# orbit simple 2d
<img src="https://raw.githubusercontent.com/cdaringe/orbit-simple-2d/master/img/orbit_low_res.gif" height="250" width="250" >

creates a series of nodes to perform a circular orbit.  each node lives in its own self contained canvas element, and can be configured with various orbital properties.  see example for full property disclosure.

1. create a `<canvas id="orbitter">`
1. when the DOM is ready, create your Orbitter, nodes, and properties!
1. call the nodes to orbit and home

```js
var orbitter = new Orbit({
    debug: true,
    id: "orbitter",
    size: [350, 350],
    speed: {
        t: 30                   // theta, *rpm*
    },
    timeToOrbit: 1000,          // time to orbit radius & theta alignment, ms
    timeToHome:  1000,          // time to home from orbit, ms (defaults to timeToOrbit val)
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
            dir: -1             // clockwise
        }
        , {
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

```

## Build
To build your own, consult `src/orbit-example.js`.  Use any normal commonJs build process you desire!  I have configured this repo to build using `grunt` and `grunt-watchify` (wrapped `browserify`).  If you just care to edit my orbit-example.js, run the following from the repo root:

1. `npm i`
1. `grunt`

The final js is placed in `build/`.  Open the index.html file to preview.

## ToDo
1. rather than refreshing at a fixed 50/60 Hz, self adjust per browser performance

## Thanks

1. handy gif tutorial: [Chris Messina](http://chrismessina.me/b/13913393/mov-to-gif)
