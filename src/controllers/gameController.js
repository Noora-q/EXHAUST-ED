(function(exports) {

  function GameController(gameView = new GameView(), game = new Game()) {
    this.gameView = gameView;
    this.game = game;
    controller = this;
    this.intervalTimer;
    this.keys = {};
    this.createObstacles();
    this.bindKeys();
    this.updateGame(this.game.car);
  }

  GameController.prototype.createObstacles = function () {
    this.game.addObstacle(new Obstacle(5, 100, "red", 500, 100));
    this.game.addObstacle(new Obstacle(5, 100, "red", 700, 0));
    this.game.addObstacle(new Obstacle(5, 100, "red", 700, 200));
    this.game.addObstacle(new Obstacle(5, 100, "red", 900, 200));
    this.game.addObstacle(new Obstacle(5, 100, "red", 1100, 50));
    this.game.addObstacle(new Obstacle(5, 100, "red", 100, 100));
    this.game.addObstacle(new Obstacle(5, 100, "red", 300, 0));
    this.game.addObstacle(new Obstacle(5, 100, "red", 200, 200));
    this.game.addObstacle(new Obstacle(5, 100, "red", 950, 0));
  };

  GameController.prototype.bindKeys = function () {
    window.addEventListener('keyup', this._keyupHandler, false);
    window.addEventListener('keydown', this._keydownHandler, false);
  };

  GameController.prototype.unbindKeys = function () {
    window.removeEventListener('keyup', this._keyupHandler, false);
    window.removeEventListener('keydown', this._keydownHandler, false);
  };

  GameController.prototype.keyup = function (key) {
    if(key.keyCode == 32){
      if(this.countdownFinished) {
        this.game.car.accelerate();
      }
    }
    this._removeKey(key);
  };

  GameController.prototype.keydown = function (key) {
    this._addKey(key);
    if(key.keyCode === 13){
      if((!this.game.isPlaying()) && (!this.countdownStarted)) {
        this.startCountdown();
      }
    }
  };

  GameController.prototype.startCountdown = function () {
    this.countdownStarted = true;
    this.gameView.initializeTimeouts();
  };

  GameController.prototype.startGame = function () {
    this.game.begin();
    this.intervalTimer = setInterval(this._loop, 1);
  };

  GameController.prototype.updateGame = function (car) {
    this._updateCarPosition(car);
    this.gameView.clearCanvas();
    this.gameView.draw(car);
    this.gameView.drawObstacles(this.game.obstacles);
    this.gameView.flashLapTime("Current drag time: " + (this.game.getCurrentDuration() / 1000.0).toFixed(2));
  };

  GameController.prototype.reachedFinishLine = function (car) {
    return car.getPosition().xCoord >= 1220;
  };


    GameController.prototype.collidingFront = function (car) {
      if(this.game.obstacles){
        var obstaclesArray = this.game.obstacles;
        for (i = 0; i < obstaclesArray.length; i++) {
          if(((car.xPosition + car.width).toFixed(0)) == obstaclesArray[i].xPosition) {
            if ((car.yPosition + car.height >= obstaclesArray[i].yPosition - car.height) && (car.yPosition + car.height <= obstaclesArray[i].yPosition + obstaclesArray[i].height + car.height)) {
              if ((car.yPosition <= obstaclesArray[i].yPosition + obstaclesArray[i].height + car.height) && (car.yPosition >= obstaclesArray[i].yPosition - car.height)) {
                return true;
              }
            }
          }
        }
      }
      return false;
    };

    GameController.prototype.collidingTop = function (car) {
      if(this.game.obstacles){
        var obstaclesArray = this.game.obstacles;
        for (i = 0; i < obstaclesArray.length; i++) {
          if((car.xPosition + car.width > obstaclesArray[i].xPosition) && (car.xPosition < obstaclesArray[i].xPosition + obstaclesArray[i].width)){
            if((car.yPosition + car.height >= obstaclesArray[i].yPosition) && car.yPosition <= obstaclesArray[i].yPosition) {
              return true;
            }
          }
        }
      }
      return false;
    };

    GameController.prototype.collidingBottom = function (car) {
      if(this.game.obstacles){
        var obstaclesArray = this.game.obstacles;
        for (i = 0; i < obstaclesArray.length; i++) {
          if((car.xPosition + car.width > obstaclesArray[i].xPosition) && (car.xPosition < obstaclesArray[i].xPosition + obstaclesArray[i].width)){
            if((car.yPosition <= obstaclesArray[i].yPosition + obstaclesArray[i].height) && (car.yPosition + car.height > obstaclesArray[i].yPosition + obstaclesArray[i].height)) {
              return true;
            }
          }
        }
      }
      return false;
    };

  GameController.prototype._loop = function() {
    controller.updateGame(controller.game.car);
    if(controller.reachedFinishLine(controller.game.car)){
      clearInterval(controller.intervalTimer);
      controller.unbindKeys();
      controller.gameView.flashLapTime(controller.gameView.getDurationString(controller.game.end()));
    }
  };

  GameController.prototype._updateCarPosition = function (car) {
    if(this.keys){
      if(this.keys[38]){
        if(!this.collidingBottom(car)){
            car.moveUp();
        }
      }
      if(this.keys[40]){
        if(!this.collidingTop(car)){
          car.moveDown();
        }
      }
    }
    if(!this.collidingFront(car)){
      car.moveForward();
    }
    else{
      car.moveBackward();
      car.resetSpeed();
    }
  };

  GameController.prototype._addKey = function (key) {
    this.keys[key.which] = true;
  };

  GameController.prototype._removeKey = function (key) {
    delete this.keys[key.which];
  };

  GameController.prototype._keyupHandler = function(e) {
    controller.keyup(e);
  };

  GameController.prototype._keydownHandler = function(e) {
    controller.keydown(e);
  };

  exports.GameController = GameController;
})(this);
