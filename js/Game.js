const DEFAULT_OPTIONS = {
  sizeX: 20,
  sizeY: 20,
  pixelSize: 20,
  color: 'black',
  initialMoveInterval: 300,
};

class Game {
  constructor(options = DEFAULT_OPTIONS) {
    this.options = options;
    this.createGameField();
    this.initialize();
    window.onkeydown = this.onKeyDown.bind(this);
  }

  start() {
    this.updateInterval(this.moveInterval);
    stopButton.className = '';
    stopButton.innerText = 'Pause';
    restartButton.className = 'hidden';
    document.getElementById('message').className = 'none';
  }

  initialize() {
    if (this.blinkTimerId) {
      clearInterval(this.blinkTimerId);
      this.blinkTimerId = null;
    }
    restartButton.className = 'hidden';
    document.getElementById('message').className = 'none';

    this.moveInterval = this.options.initialMoveInterval;
    const startPos = {
      x: Math.floor(this.options.sizeX / 2),
      y: Math.floor(this.options.sizeY / 2)
    };
    this.moveDirection = MOVE_DIRECTION.DOWN;
    this.snake = new Snake(startPos, 3, this.moveDirection);
    this.target = this.generateTarget();
    this.draw();
  }

  createGameField() {
    this.display = []; // storage for links to all 'pixel' (td) elements
    this.table = document.getElementById('table');
    if (!this.table) {
      throw Error('There is no game field table defined in HTML');
    }

    for (let i = 0; i < this.options.sizeY; i++) {
      const tr = document.createElement('tr');
      tr.setAttribute('height', this.options.pixelSize);
      this.display.push([]);
      for (let j = 0; j < this.options.sizeX; j++) {
        const td = document.createElement('td');
        td.setAttribute('width', this.options.pixelSize);
        tr.appendChild(td);
        this.display[i].push(td);
      }
      this.table.appendChild(tr);
    }
  }

  stop(gameOver = false) {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
      stopButton.innerText = 'Resume';
    }
    const messageDiv = document.getElementById('message');
    messageDiv.className = gameOver ? 'visible gameOver' : 'visible';
    messageDiv.innerText = gameOver ? 'Game Over' : 'Game Stopped';
  }

  updateInterval(moveInterval) {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.moveInterval = moveInterval;
    this.timerId = setInterval(this.doMove.bind(this), this.moveInterval);
  }

  doMove() {
    if (!this.snake) {
      throw Error('There is no snake');
    }
    if (this.snake.checkWillEat(this.target, this.moveDirection)) {
      this.snake.eat(this.target);
      this.snake.move(this.moveDirection);
      this.target = this.generateTarget();
      this.updateInterval(this.moveInterval * 0.9);
    } else {
      this.snake.move(this.moveDirection);
    }

    if (this.snake.hasCollision
      || this.snake.isOutOfBoundaries(this.options.sizeX - 1, this.options.sizeY - 1)) {
      this.gameOver();
    } else {
      this.draw();
    }
  }

  draw(clear = false) {
    if (!this.snake) {
      throw Error('There is no snake');
    }

    for (let i = 0; i < this.options.sizeY; i++) {
      for (let j = 0; j < this.options.sizeX; j++) {
        const pixel = this.display[i][j];
        if (!clear && (this.snake.hasSectionAt(j, i) || this.target.checkPosition(j, i))) {
          pixel.className = 'marked';
        } else {
          pixel.className = '';
        }
      }
    }
  }

  onKeyDown(evt) {
    switch (evt.key) {
      case 'ArrowUp':
        if (this.snake.moveDirection !== MOVE_DIRECTION.DOWN) {
          this.moveDirection = MOVE_DIRECTION.UP;
        }
        break;
      case 'ArrowDown':
        if (this.snake.moveDirection !== MOVE_DIRECTION.UP) {
          this.moveDirection = MOVE_DIRECTION.DOWN;
        }
        break;
      case 'ArrowLeft':
        if (this.snake.moveDirection !== MOVE_DIRECTION.RIGHT) {
          this.moveDirection = MOVE_DIRECTION.LEFT;
        }
        break;
      case 'ArrowRight':
        if (this.snake.moveDirection !== MOVE_DIRECTION.LEFT) {
          this.moveDirection = MOVE_DIRECTION.RIGHT;
        }
        break;
    }
    if (!this.timerId && evt.key.startsWith('Arrow')) {
      this.start();
    }
  }

  gameOver() {
    this.stop(true);
    this.blink(3);

    restartButton.className = '';
    stopButton.className = 'hidden';
  }

  blink(blinkCount) {
    let count = 0;
    this.blinkTimerId = setInterval(() => {
      if (count === blinkCount * 2) {
        clearInterval(this.blinkTimerId);
        this.blinkTimerId = null;
      } else {
        this.draw(count % 2 === 0);
        count++;
      }
    }, 500)
  }

  generateTarget() {
    let target;
    do {
      target = new Section(
        this.randomInteger(0, this.options.sizeX - 1),
        this.randomInteger(0, this.options.sizeY - 1)
      );
    } while (this.snake.hasSectionAt(target.x, target.y));
    return target;
  }

  randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
}
