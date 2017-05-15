function Snake(x, y, xspeed, yspeed, total, tail, weights) {
  this.x = x;
  this.y = y;
  this.xspeed = xspeed;
  this.yspeed = yspeed;
  this.total = total;
  this.tail = tail.slice();
  this.weights = weights;
  this.heuristic = new Heuristic(this, this.weights);

  this.eat = function(pos) {
    let d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      return true;
    } else {
      return false;
    }
  }

  this.dir = function(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  this.death = function() {
    let die = false;
    // console.log(timeout);
    if (this.x === scale*-1 || this.x === width ||
        this.y === scale*-1 || this.y === height  ) {
      die = true;
    } else if (frameCount === timeout) {
      die = true;
    } else {
      for (let i = 0; i < this.tail.length; i++) {
        let pos = this.tail[i];
        let d = dist(this.x, this.y, pos.x, pos.y);
        if (d < 1) {
          die = true;
          break;
        }
      }
    }
    
    return die;
  }

  this.end = function() {
    let cols = width/scale;
    let rows = height/scale;
    if(this.tail.length === cols*rows-1) {
      this.xspeed = 0;
      this.yspeed = 0;
      return true;
    }
    return false;
  }

  this.update = function() {
    if (this.total === this.tail.length) {   //didnt eat food
      for (let i = 0; i < this.tail.length-1; i++) {
        this.tail[i] = this.tail[i+1];
      }
    }
    this.tail[this.total-1] = createVector(this.x, this.y);

    this.x = this.x + this.xspeed*scale;
    this.y = this.y + this.yspeed*scale;

    this.x = constrain(this.x, scale*-1, width);
    this.y = constrain(this.y, scale*-1, height);
  }

  this.makeMove = function(dir) {
    switch (dir) {
      case 0:
        this.xspeed = 1;
        this.yspeed = 0;
        break;
      case 1:
        this.xspeed = -1;
        this.yspeed = 0;
        break;
      case 2:
        this.xspeed = 0;
        this.yspeed = 1;
        break;
      case 3:
        this.xspeed = 0;
        this.yspeed = -1;
        break;
      default :
        console.log("NOWHERE TO GO");
    }
    if (this.total === this.tail.length) {   //didnt eat food
      for (let i = 0; i < this.tail.length-1; i++) {
        this.tail[i] = this.tail[i+1];
      }
    }
    this.tail[this.total-1] = createVector(this.x, this.y);

    this.x = this.x + this.xspeed*scale;
    this.y = this.y + this.yspeed*scale;

    this.x = constrain(this.x, scale*-1, width);
    this.y = constrain(this.y, scale*-1, height);
  }

  this.show = function() {
    fill(255);
    for (let i = 0; i < this.tail.length; i++) {
      rect(this.tail[i].x, this.tail[i].y, scale, scale);
    }
    rect(this.x, this.y, scale, scale);
  }

  /* return best direction
    0 : right
    1 : left
    2 : up
    3 : down
  */
  this.pickDir = function() {
    let bestFitness = Number.NEGATIVE_INFINITY;
    let ds;
    let fitness;
    let dir = -1;

    ds = new Snake(this.x, this.y, 1, 0, this.total, this.tail, this.weights);
    ds.update();
    fitness = ds.heuristic.calculateFitness();
    if (bestFitness < fitness) {
      bestFitness = fitness;
      dir = 0;
    }

    ds = new Snake(this.x, this.y, -1, 0, this.total, this.tail, this.weights);
    ds.update();
    fitness = ds.heuristic.calculateFitness();
    if (bestFitness < fitness) {
      bestFitness = fitness;
      dir = 1;
    }

    ds = new Snake(this.x, this.y, 0, 1, this.total, this.tail, this.weights);
    ds.update();
    fitness = ds.heuristic.calculateFitness();
    if (bestFitness < fitness) {
      bestFitness = fitness;
      dir = 2;
    }

    ds = new Snake(this.x, this.y, 0, -1, this.total, this.tail, this.weights);
    ds.update();
    fitness = ds.heuristic.calculateFitness();
    if (bestFitness < fitness) {
      bestFitness = fitness;
      dir = 3;
    }

    return dir;
  }

}
