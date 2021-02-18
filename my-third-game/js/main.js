import "./phaser.js";

var config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  backgroundColor: '#2d2d2d',
  
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
var keys, player, diamondGroup,scoreText,score = 0,ding;

function preload() {
	//found from free resource on phaser.examples
	this.load.image('diamond',"assets/Teal Gem 2.png");
	//found from free resource on itch.io
	this.load.image('man', "assets/bikkuriman.png");
	//found on youtube
	this.load.audio('ding','assets/noise.wav');
}

function create() {
	//found tutorial online 
	keys = this.input.keyboard.addKeys("W,A,S,D");
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
		player.setVelocityX(-300);
	} 
	else if (keys.D.isDown) {
		player.setVelocityX(300);
	}

	if (keys.W.isDown) {
		player.setVelocityY(-300);
	} 
	else if (keys.S.isDown) {
		player.setVelocityY(300);
	}
	 
}
//function to delete overlapped diamonds from the playspace
//plays a noise and updates score
function collectDiamond (player, diamondGroup) {
	
	diamondGroup.disableBody(true,true);
	
	score += 50;
	scoreText.setText('Score: ' + score);
	ding.play();

}

var game = new Phaser.Game(config);
