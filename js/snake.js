function Snake (x, y, xSpeed, ySpeed, total, tail, weights, eatCount) {

    this.eat = function (pos) {
        let d = dist(this.x, this.y, pos.x, pos.y);
        if (d < 1) {
            this.total++;
            this.eatCount = 0;
            return true;
        }

        return false;
    };

    this.dir = function (x, y) {
        this.xSpeed = x;
        this.ySpeed = y;
    };

    this.death = function () {
        let die = false;
        if (this.x === scale * -1 || this.x === width ||
            this.y === scale * -1 || this.y === height) {
            die = true;
        } else if (frameCount === timeout) {
            die = true;
        } else {
            this.tail.every(function (t) {
               let d = dist(this.x, this.y, t.x, t.y);
               if (d < 1) {
                   die = true;
                   return false;
               }
               return true;
            }.bind(this));
        }

        return die;
    };

    this.end = function () {
        let cols = width / scale;
        let rows = height / scale;
        if (this.tail.length === cols * rows - 1) {
            this.xSpeed = 0;
            this.ySpeed = 0;
            return true;
        }
        return false;
    };

    this.update = function () {
        this.previousPos.x = this.x;
        this.previousPos.y = this.y;
        if (this.total === this.tail.length) {   // não comeu
            for (let i = 0; i < this.tail.length - 1; i++) {
                this.tail[ i ] = this.tail[ i + 1 ];
            }
        }
        this.tail[ this.total - 1 ] = createVector(this.x, this.y);
        this.x = this.x + this.xSpeed * scale;
        this.y = this.y + this.ySpeed * scale;
        this.x = constrain(this.x, scale * -1, width);
        this.y = constrain(this.y, scale * -1, height);
    };

    this.nextDirection = function (dir) {
        switch (dir) {
            case RIGHT:
                this.xSpeed = 1;
                this.ySpeed = 0;
                return false;
            case LEFT:
                this.xSpeed = -1;
                this.ySpeed = 0;
                return false;
            case UP:
                this.xSpeed = 0;
                this.ySpeed = 1;
                return false;
            case DOWN:
                this.xSpeed = 0;
                this.ySpeed = -1;
                return false;
            default :
                // nenhum lugar para ir
                return true;
        }
    };

    this.makeMove = function (dir) {
        this.previousPos.x = this.x;
        this.previousPos.y = this.y;
        this.eatCount++;
        if (this.nextDirection(dir)) {
            return true;
        }
        if (this.total === this.tail.length) {   //didnt eat food
            for (let i = 0; i < this.tail.length - 1; i++) {
                this.tail[ i ] = this.tail[ i + 1 ];
            }
        }
        this.tail[ this.total - 1 ] = createVector(this.x, this.y);
        this.x = this.x + this.xSpeed * scale;
        this.y = this.y + this.ySpeed * scale;
        this.x = constrain(this.x, scale * -1, width);
        this.y = constrain(this.y, scale * -1, height);
        return false;
    };

    this.show = function () {
        fill(255);
        for (let i = 0; i < this.tail.length; i++) {
            rect(this.tail[ i ].x, this.tail[ i ].y, scale, scale);
        }
        rect(this.x, this.y, scale, scale);
    };

    this.pickDir = function () {
        let bestFitness = Number.NEGATIVE_INFINITY;
        let fitness;
        let nextDirection = -1;
        let temporarySnake = new Snake(this.x, this.y, 1, 0, this.total, this.tail, this.weights, this.eatCount);
        temporarySnake.update();
        fitness = temporarySnake.heuristic.calculateFitness();
        if (bestFitness < fitness) {
            bestFitness = fitness;
            nextDirection = RIGHT;
        }
        temporarySnake = new Snake(this.x, this.y, -1, 0, this.total, this.tail, this.weights, this.eatCount);
        temporarySnake.update();
        fitness = temporarySnake.heuristic.calculateFitness();
        if (bestFitness < fitness) {
            bestFitness = fitness;
            nextDirection = LEFT;
        }
        temporarySnake = new Snake(this.x, this.y, 0, 1, this.total, this.tail, this.weights, this.eatCount);
        temporarySnake.update();
        fitness = temporarySnake.heuristic.calculateFitness();
        if (bestFitness < fitness) {
            bestFitness = fitness;
            nextDirection = UP;
        }
        temporarySnake = new Snake(this.x, this.y, 0, -1, this.total, this.tail, this.weights, this.eatCount);
        temporarySnake.update();
        fitness = temporarySnake.heuristic.calculateFitness();
        if (bestFitness < fitness) {
            nextDirection = DOWN;
        }

        return nextDirection;
    };

    const RIGHT = 0;

    const LEFT = 1;

    const UP = 2;

    const DOWN = 3;

    this.x = x;

    this.y = y;

    this.xSpeed = xSpeed;

    this.ySpeed = ySpeed;

    this.total = total;

    this.tail = tail.slice();

    this.weights = weights;

    this.previousPos = createVector(-1, -1);

    this.heuristic = new Heuristic(this, this.weights);

    this.eatCount = eatCount;
}
