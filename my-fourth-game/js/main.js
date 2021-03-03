import "./phaser.js";

var config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 640,
  height: 480,
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
//declaring variables
var snake;
var food;
var cursors;
var caught;
var dead;
var bg;
//directions
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;

var game = new Phaser.Game(config);


function preload() {
	//found on itch.io from BurgerBunn
	this.load.image('bg','assets/forest.png');
	//got image from google
	this.load.image('food','assets/metamucil.png');
	//got image from google
	this.load.image('body','assets/grandma.png');
	//from looney tunes sound board
	this.load.audio('caught','assets/caught.mp3');
	//looney tunes sound board
	this.load.audio('death','assets/dead.mp3');
}

function create() {
	this.add.image(320,240,'bg');
	caught = this.sound.add('caught',{loop:false});
	dead = this.sound.add('death',{loop:false});
	//class for food
	var Food = new Phaser.Class({
		
		Extends: Phaser.GameObjects.Image,
		
		initialize:
		//food class
		function Food (scene,x,y) {
			
			Phaser.GameObjects.Image.call(this, scene)

            this.setTexture('food');
            this.setPosition(x * 16, y * 16);
            this.setOrigin(0);

            this.total = 0;

            scene.children.add(this);
        },
		
		eat: function() {
			
			this.total++;
			
			var x = Phaser.Math.Between(0,39);
			var y = Phaser.Math.Between(0,29);
			
			this.setPosition(x * 16, y * 16);
		}
	});
	//snake class
	var Snake = new Phaser.Class({
		
		initialize:
		
		function Snake (scene,x,y) {
			
			this.headPosition = new Phaser.Geom.Point(x,y);
			
			this.body = scene.add.group();
			
			this.head = this.body.create(x * 16, y * 16, 'body');
			this.head.setOrigin(0);
			
			this.alive = true;
			
			this.speed = 100;
			
			this.moveTime = 0;
			
			this.tail = new Phaser.Geom.Point(x,y);
			
			this.heading = RIGHT;
			this.direction = RIGHT;
			
		},
		
		update: function(time) {
			if(time >= this.moveTime) {
				return this.move(time);
			}
		},
		//controls
		faceLeft: function () {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = LEFT;
            }
        },
		
		faceRight: function () {
            if (this.direction === UP || this.direction === DOWN)
            {
                this.heading = RIGHT;
            }
        },
		
		faceUp: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = UP;
            }
        },
		
		faceDown: function ()
        {
            if (this.direction === LEFT || this.direction === RIGHT)
            {
                this.heading = DOWN;
            }
        },
		
		move: function (time) {
            
            switch (this.heading)
            {
                case LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                    break;

                case RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                    break;

                case UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 30);
                    break;

                case DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 30);
                    break;
            }
			
			this.direction = this.heading;
			
			Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1,this.tail);
			//if player collides with themself
			var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), {x: this.head.x, y: this.head.y},1);
			
			if(hitBody) {
				console.log('dead');
				
				dead.play();
				
				this.alive = false;
				
				return false;
			}
			else {
				
				this.moveTime = time + this.speed;
			
				return true;
			}
		},
		//function to grow
		grow: function() {
			
			var newPart = this.body.create(this.tail.x, this.tail.y, 'body');
			
			newPart.setOrigin(0);
		},
		//function for player colliding with food
		collideWithFood: function(food) {
			
			if(this.head.x === food.x && this.head.y === food.y) {
				
				this.grow();
				food.eat();
				caught.play();
				
				if(this.speed > 20 && food.total % 5 === 0) {
					this.speed -= 5;
				}
				
				return true;
			}
			else { 
			
				return false;
			}
		},
		
		updateGrid: function(grid) {
			
			this.body.children.each(function(segment) 
			{
				var bx = segment.x / 16;
				var by = segment.y / 16;
				
				grid[by][bx] = false;
				
			});
			
			return grid;
		}
	});
	
	food = new Food(this,3,4);
	
	snake = new Snake(this, 8, 8);
	
	cursors = this.input.keyboard.createCursorKeys();

}


function update(time,delta) {
	//restart game
	if(!snake.alive) {
		this.registry.destroy(); 
		this.events.off();﻿ 
		this.scene.restart();﻿﻿﻿﻿ 
		return;
	}
	//updating controls
	if (cursors.left.isDown)
    {
        snake.faceLeft();
    }
    else if (cursors.right.isDown)
    {
        snake.faceRight();
    }
    else if (cursors.up.isDown)
    {
        snake.faceUp();
    }
    else if (cursors.down.isDown)
    {
        snake.faceDown();
    }
	//checking collision with food
	if(snake.update(time)) {
		
		if(snake.collideWithFood(food)) {
			
			repositionFood();
			
		}
	}
}
//making sure food doesnt spawn where character is
function repositionFood() {
	
	var testGrid = [];
	
	for(var y = 0; y < 30; y++) {
		testGrid[y] = [];
		
		for(var x = 0; x < 40; x++) {
			testGrid[y][x] = true;
		}
	}
	snake.updateGrid(testGrid);
	
	var validLocations = [];
	
	for (var y = 0; y < 30; y++)
    {
        for (var x = 0; x < 40; x++)
        {
            if (testGrid[y][x] === true)
            {
                validLocations.push({ x: x, y: y });
            }
        }
    }
	
	if(validLocations.length > 0) {
		var pos = Phaser.Math.RND.pick(validLocations);
		
		food.setPosition(pos.x * 16, pos.y * 16);
		
		return true;
	}
	else {
		return false;
	}
}

