/*defines alien starting positions*/
  var levelData = { 
     1:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,2,2,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0]],
     2:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,2,2,0,2,2,0,2,2,0],
          [0,0,1,1,0,1,1,0,1,1,0],
          [0,0,0,0,0,0,0,0,0,0,0]],
	    3:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [2,0,2,0,2,0,2,0,2,0,2],
          [0,1,0,1,0,1,0,1,0,1,0],
          [2,0,2,0,2,0,2,0,2,0,2],
          [0,1,0,1,0,1,0,1,0,1,0],
          [2,0,2,0,2,0,2,0,2,0,2],
          [0,1,0,1,0,1,0,1,0,1,0]],
		   4: [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0]],
	 		 4: [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,2,0,2,0,2,0,2,0,2,0],
          [1,0,1,0,1,0,1,0,1,0,1],
          [0,1,0,1,0,1,0,1,0,1,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,2,2,2,2,2,2,2,2,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,1,1,1,1,1,1,0]] 
			
		};


/*Defines individual sprites from sprite sheet - multiple frames need to be positioned
to the right of frame 1*/
  var spriteData = {
    'alien1': { sx: 0,  sy: 0,  w: 28, h: 26, cls: Alien, frames: 2 },
    'alien2': { sx: 0,  sy: 26, w: 28, h: 26, cls: Alien, frames: 2 },
    'player': { sx: 0,  sy: 52, w: 32, h: 39, cls: Player },
    'missile': { sx: 0,  sy: 86, w: 2,  h: 14, cls: Missile }
  }

  function startGame() {
	 
	     if (localStorage.getItem("highScore")) { //if highScore exists in local storage
        mostKills = localStorage.getItem("highScore"); //set value to mostKills
    }
	 
    var screen = new GameScreen("Planet Invasion","press enter to start","",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
    Game.loop();
  }

  function endGame() {
	 
	         if (kills > mostKills) { //if the current kill count is higher than the high score
						alert("New high score of "+kills); //alert player of new high score
            mostKills = kills; //set high score to equal current kill count
						localStorage.setItem("highScore", mostKills); //save high score to local storage
					 }
	 
    var screen = new GameScreen("Game Over! Aliens Killed: " +kills, "(press enter to restart)",		"High Score: " +mostKills,
																function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }


  function winGame() {
    var screen = new GameScreen("You Win! Aliens Killed:" +kills, "(press enter to restart)","",
                                 function() {
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }

  $(function() {
    GameAudio.load({ 'fire' : 'media/laser.ogg', 'die' : 'media/explosion.ogg' }, 
                   function() { 
                       Game.initialize("#gameboard", levelData, spriteData,
                                      { "start": startGame,
                                        "die"  : endGame,
                                        "win"  : winGame });
                   });
   });



