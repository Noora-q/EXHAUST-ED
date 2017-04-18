(function(exports) {

  function GameView(game = new Game()) {
    this.game = game;
    this.createCanvas();
  }

  GameView.prototype.createCanvas = function (element = document.getElementById('canvas_container')) {
    canvasHTML = '<canvas id="canvas" width="1260" height="300" style="border: solid 1px; z-index: 1; position: absolute;"></canvas><canvas id="canvas" width="1260" height="300" style="border: solid 1px; z-index: 0; position: absolute;"></canvas>';
    element.innerHTML = canvasHTML;
    this.track = element.children[0];
    context = this.track.getContext('2d');
    this.trackGround = element.children[1];
    trackGroundContext = this.trackGround.getContext('2d');
    var road = new Image();
    road.src = "road_NOyellowline_cropped.jpg"
    road.onload = function() {
      trackGroundContext.drawImage(road, 0, 0);
    };
    var car = this.game.car;
    car.sprite.onload = function() {
      context.drawImage(car.sprite, car.xPosition, car.yPosition);
    };
  };

  GameView.prototype.draw = function (car) {
    context = this.track.getContext('2d');
    context.drawImage(car.sprite, car.xPosition, car.yPosition);
    this._drawLines(context);
  };

  GameView.prototype.clearCanvas = function () {
    context = this.track.getContext('2d');
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  };

  GameView.prototype.getDurationString = function (duration) {
    return "Your drag time was: " + (duration / 1000.0).toFixed(2) + " s";
  };

  GameView.prototype.flashLapTime = function(message){
    $('#drag_time').html('<h1>' + message + '</h1>');
  };

  GameView.prototype.initializeTimeouts = function (element = document.getElementById('countdown')) {
    element.innerHTML = '3';
    setTimeout(function(){ element.innerHTML = '2'; }, 1000);
    setTimeout(function(){ element.innerHTML = '1'; }, 2000);
    setTimeout(function(){
      document.getElementById('welcome_message').style.display = 'none';
      controller.countdownFinished = true;
      controller.startGame();
    }, 3000);
  };

  GameView.prototype._drawLines = function() {
    this._drawStartLine();
    this._drawFinishLine();
  };

  GameView.prototype._drawFinishLine = function () {
    context = this.track.getContext('2d');
    context.beginPath();
    context.strokeStyle = 'red';
    context.moveTo(this.track.width - this.game.car.width,0);
    context.lineTo(this.track.width - this.game.car.width,this.track.height);
    context.stroke();
  };

  GameView.prototype._drawStartLine = function () {
    context = this.track.getContext('2d');
    context.beginPath();
    context.strokeStyle = 'green';
    context.moveTo(this.game.car.width,0);
    context.lineTo(this.game.car.width,this.track.height);
    context.stroke();
  };

  GameView.prototype.drawObstacles = function (obstacles) {
    context = this.track.getContext('2d');
    obstacles.forEach(function(item, index, array){
      context.fillStyle = item.colour;
      context.fillRect(item.xPosition, item.yPosition, item.width, item.height);
    });
  };

  exports.GameView = GameView;
})(this);
