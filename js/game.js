var AlienFlock = function AlienFlock() {
  this.invulnrable = true;
  this.dx = 10; this.dy = 0;
  this.hit = 1; this.lastHit = 0;
  this.speed = 10; //Changes alien speed

  this.draw = function() {};

  this.die = function() {
    if(Game.board.nextLevel()) {
      Game.loadBoard(new GameBoard(Game.board.nextLevel())); 
    } else {
      Game.callbacks['win']();
    }
  }

  this.step = function(dt) { 
    if(this.hit && this.hit != this.lastHit) {
      this.lastHit = this.hit;
      this.dy = this.speed;
    } else {
      this.dy=0;
    }
    this.dx = this.speed * this.hit;

    var max = {}, cnt = 0;
    this.board.iterate(function() {
      if(this instanceof Alien)  {
        if(!max[this.x] || this.y > max[this.x]) {
          max[this.x] = this.y; 
        }
        cnt++;
      } 
    });

    if(cnt == 0) { this.die(); } 

    this.max_y = max;
    return true;
  };

}


var Alien = function Alien(opts) {
  this.flock = opts['flock'];
  this.frame = 0;
  this.mx = 0;
}

Alien.prototype.draw = function(canvas) {
    Sprites.draw(canvas,this.name,this.x,this.y,this.frame); //draws alien on canvas
}

kills = 0

Alien.prototype.die = function() {
    GameAudio.play('die'); //initiates death audio file
    this.flock.speed += 1; //speeds up the flock upon the death of an alien
    this.board.remove(this); //removes alien from gameboard
 		kills++;
}

Alien.prototype.step = function(dt) {
  this.mx += dt * this.flock.dx;
  this.y += this.flock.dy;
  if(Math.abs(this.mx) > 10) {
    if(this.y == this.flock.max_y[this.x]) {
      this.fireSometimes();
    }
    this.x += this.mx;
    this.mx = 0;
    this.frame = (this.frame+1) % 2;//sets the number of frames to be looped
    if(this.x > Game.width - Sprites.map.alien1.w * 2) this.flock.hit = -1;
    if(this.x < Sprites.map.alien1.w) this.flock.hit = 1;
  }
  return true;
}


/*Random enemy missile fire*/
Alien.prototype.fireSometimes = function() {
      if(Math.random()*100 < 10) {
        this.board.addSprite('missile',this.x + this.w/2 - Sprites.map.missile.w/2,
                                      this.y + this.h, 
                                     { dy: 100 });
      }
    
}

var Player = function Player(opts) { 
  this.reloading = 0;
}

Player.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'player',this.x,this.y);
}


Player.prototype.die = function() {
  GameAudio.play('die');
  Game.callbacks['die']();
 }


/*controls player movement*/
Player.prototype.step = function(dt) {
    //provides horizontal player movement
    if(Game.keys['left']) { this.x -= 100 * dt; }
    if(Game.keys['right']) { this.x += 100 * dt; }

    //provides vertical player movement 
    if(Game.keys['up']) { this.y -= 100 * dt; }
    if(Game.keys['down']) { this.y += 100 * dt; }
    
    //limits player movement to game height and width
    if(this.x < 0) this.x = 0;
    if(this.x > Game.width-this.w) this.x = Game.width-this.w;
    if(this.y < 0) this.y = 0;
    if(this.y > Game.height-this.h) this.y = Game.height-this.h;

  this.reloading--;

  if(Game.keys['fire'] && this.reloading <= 0 && this.board.missiles < 3) { //number of missiles before reload
    GameAudio.play('fire'); //audio file for firing
    this.board.addSprite('missile',
                          this.x + this.w/2 - Sprites.map.missile.w/2,
                          this.y-this.h,
                          { dy: -100, player: true });
    this.board.missiles++;
    this.reloading = 10;
  }
 
    var enemy = this.board.collide(this);
 			if(enemy) { 
			enemy.die();
			return false;
   }
 
  return true;
}

var Missile = function Missile(opts) {
   this.dy = opts.dy;
   this.player = opts.player;
}

/*Draws missle*/
Missile.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'missile',this.x,this.y);
}

Missile.prototype.step = function(dt) {
   this.y += this.dy * dt;

   var enemy = this.board.collide(this);
   if(enemy) { 
     enemy.die();
     return false;
   }
   return (this.y < 0 || this.y > Game.height) ? false : true;
 
}

Missile.prototype.die = function() {
  if(this.player) this.board.missiles--;
  if(this.board.missiles < 0) this.board.missiles=0;
   this.board.remove(this);
}

