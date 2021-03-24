const MOVE_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};

class Section {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  checkPosition(x, y) {
    return x === this.x && y === this.y;
  }
}

class Snake {
  constructor(headPosition, length, moveDirection) {
    if (!headPosition || isNaN(headPosition.x) || isNaN(headPosition.y)
      || isNaN(length)
      || Object.keys(MOVE_DIRECTION).map(key => MOVE_DIRECTION[key]).indexOf(moveDirection) === -1) {
      throw new Error('wrong params new Snake()');
    }

    this.moveDirection = moveDirection;
    this.sections = [];
    for (let i = length - 1; i >= 0; i--) {
      let sectionX;
      let sectionY;
      switch (moveDirection) {
        case MOVE_DIRECTION.UP:
          sectionX = headPosition.x;
          sectionY = headPosition.y + i;
          break;
        case MOVE_DIRECTION.DOWN:
          sectionX = headPosition.x;
          sectionY = headPosition.y - i;
          break;
        case MOVE_DIRECTION.LEFT:
          sectionX = headPosition.x + i;
          sectionY = headPosition.y;
          break;
        case MOVE_DIRECTION.RIGHT:
          sectionX = headPosition.x - i;
          sectionY = headPosition.y;
          break;
      }
      this.sections.push(new Section(sectionX, sectionY));
    }
  }

  hasSectionAt(x, y) {
    return this.sections.some(section => section.x === x && section.y === y);
  }

  get head() {
    return this.sections[this.sections.length - 1];
  }

  get hasCollision() {
    return this.sections.some(sectionA => {
      return this.sections.some(sectionB => sectionA !== sectionB && sectionA.checkPosition(sectionB.x, sectionB.y));
    });
  }

  isOutOfBoundaries(maxX, maxY) {
    return this.sections.some(({ x, y }) => x < 0 || x > maxX || y < 0 || y > maxY);
  }

  move(moveDirection) {
    if (!moveDirection) {
      throw Error('I dont know where to move');
    }
    this.moveDirection = moveDirection;
    this.sections.map((section, index) => {
      if (section === this.head) {
        switch (moveDirection) {
          case MOVE_DIRECTION.UP:
            section.y--;
            break;
          case MOVE_DIRECTION.DOWN:
            section.y++;
            break;
          case MOVE_DIRECTION.LEFT:
            section.x--;
            break;
          case MOVE_DIRECTION.RIGHT:
            section.x++;
            break;
        }
      } else {
        const nextSection = this.sections[index + 1];
        section.x = nextSection.x;
        section.y = nextSection.y;
      }
    });
  }

  checkWillEat(target, moveDirection) {
    switch (moveDirection) {
      case MOVE_DIRECTION.UP:
        if (this.head.x === target.x && this.head.y - 1 === target.y) {
          return true;
        }
        break;
      case MOVE_DIRECTION.DOWN:
        if (this.head.x === target.x && this.head.y + 1 === target.y) {
          return true;
        }
        break;
      case MOVE_DIRECTION.LEFT:
        if (this.head.x - 1 === target.x && this.head.y === target.y) {
          return true;
        }
        break;
      case MOVE_DIRECTION.RIGHT:
        if (this.head.x + 1 === target.x && this.head.y === target.y) {
          return true;
        }
        break;
    }
    return false;
  }

  eat(target) {
    this.sections.push(target);
  }
}
