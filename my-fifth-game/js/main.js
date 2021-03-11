import "./phaser.js";

var config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  backgroundColor: 'black',
  
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "arcade",
  }
};
//declaration
var keys, player, diamondGroup, bg, scoreText,score = 0,ding,speedBoost = 0,gameOverText,song;

function preload() {
	//found from free resource on phaser.examples
	this.load.image('diamond',"assets/Teal Gem 2.png");
	//found from free resource on itch.io
	this.load.image('man', "assets/bikkuriman.png");
	//found in asset pack
	this.load.image('bg', 'assets/starbg.png');
	//found on youtube
	this.load.audio('ding','assets/noise.wav');
	//music by Nicole Marie T...found on itch.io
	this.load.audio('bgMusic', 'assets/gfunk.wav');
}

function create() {
	//found tutorial online 
	keys = this.input.keyboard.addKeys("W,A,S,D");
	song = this.sound.add('bgMusic',{volume: 0.25, loop: true});
	song.play();
	this.add.image(400,300,'bg');
	//phaser.io tutorial 
	diamondGroup = this.physics.add.group({
		key: 'diamond',
		frameQuantity: 20,
	});
	
	var children = diamondGroup.getChildren();
	
	for(var i = 0; i < children.length; i++) {
		
		var x = Phaser.Math.Between(25,775);
		var y = Phaser.Math.Between(25,575);
		
		children[i].setPosition(x,y);
	}
	//making my playable character
	player = this.physics.add.image(400, 300, "man")
		.setCollideWorldBounds(true);
	//checking overlap	
	this.physics.add.overlap(player, diamondGroup, collectDiamond);
	//phaser.io example 
	scoreText = this.add.text(12,12,'score: 0', {fontSize: '12px', fill: '#FFFF00'});
	
	ding = this.sound.add('ding',{loop: false});
	
}


function update() {
	player.setVelocity(0);

	if (keys.A.isDown) {
		player.setVelocityX(-300 - speedBoost);
	} 
	else if (keys.D.isDown) {
		player.setVelocityX(300 + speedBoost);
	}

	if (keys.W.isDown) {
		player.setVelocityY(-300 - speedBoost);
	} 
	else if (keys.S.isDown) {
		player.setVelocityY(300 + speedBoost);
	}
	if(score == 1000) {
		//if all the diamonds are collected put text on screen
		//telling player to press ctrl+R to play again
		gameOverText = this.add.text(200,200,'Press ctrl+R to play again', {fontSize: '24px', fill: '#FFFF00'});
		return;
		
	}
}
//function to delete overlapped diamonds from the playspace
//plays a noise and updates score
function collectDiamond (player, diamondGroup) {
	
	diamondGroup.disableBody(true,true);
	
	score += 50;
	scoreText.setText('Score: ' + score);
	//added a speed boost for each diamond collected
	speedBoost += 25;
	ding.play();

}

var game = new Phaser.Game(config);

