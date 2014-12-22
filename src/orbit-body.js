(function (undefined) {
"use strict";

var _ = require('underscore');
var randomColor = require('randomcolor');
var refreshRate = 60; // hz
var refreshDur  = 1000/refreshRate;
var twoPi = 2*Math.PI;

function Body(config) {
    _.extend(this, config);

    // dep check
    if (!this.ctx || !this.canvas) {
        throw new Error("an orbit body/node requires a canvas and canvas context");
    }

    // compute init vals
    // set defaults, override with provided config
    this.center = {
        x: this.canvas.width/2,
        y: this.canvas.height/2
    };

    this.radiansPerSecond = (this.speed.t / 60) * twoPi; // calculate dTheata/dT (s)
    this.radiansPerMs = this.radiansPerSecond / 1000;    // calculate dTheata/dT (ms)

    this.initialThetaOffset = this.orbitPos.t - this.pos.t;
    this.thetaAlignDifferentialRate = this.initialThetaOffset / this.timeToOrbit; // radian/ms

    this.radiusTraverseRate = (this.orbitPos.r - this.pos.r) / this.timeToOrbit;

    this.pos.x = 0;
    this.pos.y = 0;

    if (this.dir < 0) {
        // orbit ccw
        this.dir = -1;
    } else {
        // orbit cw
        this.dir = 1;
    }

    this.updateCartesian();
    this.pos.home = {
        x: this.pos.x,
        y: this.pos.y,
        r: this.pos.r,
        t: this.pos.t
    };

    this.ctx.fillStyle = randomColor();
    this.radius = 5;
    if (config.style) {
        var style = config.style;
        this.ctx.fillStyle = style.color || this.ctx.fillStyle;
        this.radius = style.radius || this.radius;
    }

    // indicates if body has reached its destination theta pos,
    // in reference to its starting position for orbit
    if (this.orbitPos.t === this.pos.t) {
        this.thetaAligned = true;
    } else {
        this.thetaAligned = false;
    }

    if (this.pos.r > this.orbitPos.r) {
        this.orbitInward = true;
    } else {
        this.orbitInward = false;
    }
}

Body.prototype.draw = function() {
    this.updateCartesian();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.beginPath();
    this.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, twoPi);
    this.ctx.closePath();
    this.ctx.fill();
};


Body.prototype.updateCartesian = function() {
    this.pos.x = this.center.x + this.pos.r * Math.cos(this.pos.t);
    this.pos.y = this.center.y - this.pos.r * Math.sin(this.pos.t);
};

Body.prototype.home = function() {
    var self = this;
    if (this.inOrbit) {
        this.inOrbit = false;
    }
    if (this.tickOrbitInterval) {
        clearInterval(this.tickOrbitInterval);
    }
    this.tickHomeInterval = setInterval(
        function() {
            self.tickHome();
        },
        refreshDur
    );
};

Body.prototype.handleHomed = function() {
    clearInterval(this.tickHomeInterval);
};

Body.prototype.orbit = function() {
    var self = this;
    this.tickOrbitInterval = setInterval(
        function() {
            self.tickOrbit();
        },
        refreshDur
    );
};



/**
 * Called @30Hz, move body to next frame
 * @return {undefined}
 */
Body.prototype.tickOrbit = function() {
    this.tickThetaOrbit();
    this.tickRadiusOrbit();
    this.draw();
};
Body.prototype.tickHome = function() {
    if (this.thetaAlignDifferentialRate) {
        // TODO BROKEN
        // orbit and home thetas weren't aligned to start, so
        // adjust the return orbit
        this.thetaAligned = false;
        delete this.ticksTilThetaAligned;
        this.initialThetaOffset = -this.initialThetaOffset;
    }
    this.tickThetaOrbit();  // orbit all the way home
    this.tickRadiusHome();
    this.draw();
};



Body.prototype.tickThetaOrbit = function() {
    // add additional theta swept in this cycle,t*r=d;
    // note: if start theta and orbit theta are not aligned, the body
    // must speed up or slow down from it's standard speed in order to match
    // its relative destination theta in orbit
    if (this.thetaAligned) {
        this.pos.t += this.dir * refreshDur * this.radiansPerMs;
    } else {
        if (this.ticksTilThetaAligned === undefined) {
            this.ticksTilThetaAligned = refreshRate * this.timeToOrbit/1000;
            if (Math.floor(this.ticksTilThetaAligned) !== this.ticksTilThetaAligned) {
                // because a non-int version of ticks is required to align start
                // and orbut thetas, we must reach our destination theta faster than planned!
                if (Math.floor(this.ticksTilThetaAligned) <= 1) {
                    // handle fringe case where there's hardly any animation (1 frame)
                    this.pos.t = this.orbitPos.t;
                } else {
                    // recompute updated, faster/slower differential sweep rate
                    this.ticksTilThetaAligned = Math.floor(this.ticksTilThetaAligned);
                    this.timeToOrbit = this.ticksTilThetaAligned / (refreshRate/1000);
                    this.thetaAlignDifferentialRate = this.initialThetaOffset/this.timeToOrbit;
                }
            }
        }

        // update theta at adjusted rate to catch the desired target orbit theta.
        this.pos.t += refreshDur * this.dir * (this.radiansPerMs + this.thetaAlignDifferentialRate); // add additional theta swept
        --this.ticksTilThetaAligned;
        if (!this.ticksTilThetaAligned) {
            this.thetaAligned = true;
        }
    }

    // keep radians within 2π
    if (this.pos.t > twoPi) {
        this.pos.t = this.pos.t - twoPi;
    }
};

Body.prototype.tickRadiusOrbit = function() {
    if (!this.inOrbit) {
        this.pos.r += refreshDur * this.radiusTraverseRate;
        if (!this.orbitInward) {
            // permit radial position to grow outwards, max at orbit radius
            if (this.pos.r > this.orbitPos.r) {
                this.pos.r = this.orbitPos.r;
                this.inOrbit = true;
            }
        } else {
            // permit radial position to shrink outwards, min at orbit radius
            if (this.pos.r < this.orbitPos.r) {
                this.pos.r = this.orbitPos.r;
                this.inOrbit = true;
            }
        }
    }
};

Body.prototype.tickRadiusHome = function() {
    this.pos.r -= refreshDur * this.radiusTraverseRate;
    if (!this.orbitInward) {
        // if outer orbit, permit the node to come inward
        if (this.pos.r < this.pos.home.r) {
            // if you've made it home, stay home and disable animation
            this.pos.r = this.pos.home.r;
            this.home = true;
            if (this.tickHomeInterval) {
                clearInterval(this.tickHomeInterval);
            }
        }
    } else {
        // if inner orbit, permit the node to return outward
        if (this.pos.r > this.pos.home.r) {
            // if you've made it home, stay home and disable animation
            this.pos.r = this.pos.home.r;
            this.home = true;
            if (this.tickHomeInterval) {
                clearInterval(this.tickHomeInterval);
            }
        }
    }

};

Body.extend = function(obj) {
    return new Body(obj);
};

module.exports = Body;

})();