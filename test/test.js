"use strict"
var orbitter, orbitterDummy

beforeEach(function() {
    window.document
    .querySelector('#test')
    .innerHTML = '<canvas id="orbitter"></canvas>'
    orbitter = new Orbit({
        id: "orbitter",
        size: [400, 400],
        speed: {
            t: 30                   // rpm
        },
        timeToOrbit: 1000,          // time to orbit radius & theta alignment, ms (not really a sp)
        timeToHome: 1500,
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
            }, {
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
            }
        ]
    })
})

describe('orbit manager', function () {

    it('should create a new canvas for each node', function() {
        orbitter.nodes.length.should.equal(2)
        orbitterDummy = new Orbit({id: 'orbitter', speed: 1})
        orbitterDummy.nodes.length.should.equal(0)
    })

    it('should dominate its puny node-lings', function() {
        orbitter.homeAll.should.be.type('function')
        orbitter.orbitAll.should.be.type('function')
    })
})

describe('nodes', function() {
    it('have default node-like properties', function () {
        var node = orbitter.nodes[0]
        node.id.should.be.ok
        node.parent.should.be.ok
        node.parent.should.be.instanceof(Orbit)
        node.timeToOrbit.should.be.a.Number
        node.timeToHome.should.be.a.Number
        node.speed.should.be.a.Object
        node.speed.t.should.be.a.Number
        node.canvas.should.be.ok
        node.canvas.width.should.be.ok // 0 or '0px'
        node.canvas.height.should.be.ok
        node.canvas.style.position.should.be.a.String
        node.canvas.style.left.should.be.ok
        node.canvas.id.should.be.a.String
    })
})
