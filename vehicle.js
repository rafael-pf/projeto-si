// Seeking a Target (Seek)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/p1Ws1ZhG36g
// https://thecodingtrain.com/learning/nature-of-code/5.2-seek.html

// Seek: https://editor.p5js.org/codingtrain/sketches/AxuChwlgb
// Seek with Sliders: https://editor.p5js.org/codingtrain/sketches/DROTtSI7J
// Arrive: https://editor.p5js.org/codingtrain/sketches/dQx9oOfTN
// Pursue: https://editor.p5js.org/codingtrain/sketches/XbsgoU_of

class Vehicle {
    constructor(obstacles) {
        // generate random position

        let x = Math.floor(Math.random() * width / 50) * 50;
        let y = Math.floor(Math.random() * height / 50) * 50;

        for (let i = 0; i < obstacles.length; i++) {
            if (x >= obstacles[i].x && x < obstacles[i].x + obstacles[i].width &&
                y >= obstacles[i].y && y < obstacles[i].y + obstacles[i].height) {
                x = Math.floor(Math.random() * width / 50) * 50;
                y = Math.floor(Math.random() * height / 50) * 50;
                i = -1;
            }
        }


        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.pointer = createVector(x + 50, y + 20)
        this.maxSpeed = 4;
        this.maxForce = 0.25;
        this.size = 50;
        this.r = 16;
        this.searchRadius = 150;
    }

    seek(target) {
        let force = p5.Vector.sub(target, this.pos);
        // outside search radius
        if (force.mag() > this.searchRadius) {
            // explore
            force = p5.Vector.sub(this.pointer, this.pos)
            force.setMag(this.maxSpeed);
            force.sub(this.vel);
            force.limit(this.maxForce);
            this.applyForce(force);
        } else {
            // inside search radius
            force.setMag(this.maxSpeed);
            force.sub(this.vel);
            force.limit(this.maxForce);
            this.applyForce(force);
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.pointer = createVector(this.pos.x + 50, this.pos.y + 20)
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
        this.edges();
    }

    show() {
        stroke(255);
        strokeWeight(2);
        fill(0)
        square(this.pos.x, this.pos.y, this.size);
        fill(255);
        pop();
    }

    edges() {
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        } else if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
        }
        if (this.pos.y > height + this.r) {
            this.pos.y = -this.r;
        } else if (this.pos.y < -this.r) {
            this.pos.y = height + this.r;
        }
    }
}
