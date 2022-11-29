var timer;
var chronoText;
var winText;
var WinOrLose;
var pause = false;

function preload() {
    this.load.image('player', 'assets/image/player.png');
    this.load.image('obstacle', 'assets/image/rock.png');
    this.load.image('background', 'assets/image/background.png');
    //this.load.audio('musicBG', ['assets/audio/.mp3', 'assets/audio/.ogg']);
}

function create() {
    //music = game.add.audio('musicBG');
    //music.loop = true;
    //music.play();
    this.q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.background = this.physics.add.image(config.width/2,config.height/2,'background');
    this.background.setScale(config.width/this.background.width, config.height/this.background.height);
    
    this.player = this.physics.add.image(config.width / 2, 0, 'player').setScale(0.04, 0.04);
    this.player.setPosition(config.width / 2, config.height - (this.player.displayHeight/2));
    this.obstacle = this.physics.add.image(config.width / 2, 50, 'obstacle').setScale(0.05, 0.05);
    this.player.setCollideWorldBounds(true);
    this.player.setImmovable(true);
    this.obstacle.setImmovable(true);

    this.chronoText = this.add.text(10,10,'chrono',{fontfamily:"Passion-Regu",fill:'#dddddd',stroke:'#000000',strokeThickness:5});
    this.winText = this.add.text(config.width/3,75,'',{fontfamily:"Passion-Regu",fill:'#eeee00',stroke:'#222222',strokeThickness:6});

    this.timer = this.time.delayedCall(30000,onEvent,null,this);

    this.physics.add.collider
      (
          this.player,
          this.obstacle,
          function(_player,_obstacle)
        {
          if(_player.body.touching.up && _obstacle.body.touching.down
             || _player.body.touching.left && _obstacle.body.touching.right
             || _player.body.touching.right && _obstacle.body.touching.left)
          {WinOrLose = 'lose';}
        }
      );
}

function update() {
    var pointer = this.input.activePointer;
  
    if(this.r.isDown)
    {
      pause=false;
      WinOrLose = null;
      this.timer = this.time.delayedCall(30000,onEvent,null,this);
      this.obstacle.setVelocityY(0);
      this.player.setVelocityX(0);
      this.obstacle.setPosition(RandInt(this.obstacle.displayWidth/2,config.width - (this.obstacle.displayWidth/2)), -50);
      this.player.setPosition(config.width / 2, config.height - (this.player.displayHeight/2));
      let TimeLeft = 30+this.timer.getProgress()*-1;
    }
  
    if(pause==false)
    {
      let TimeLeft = Math.trunc(30+this.timer.getProgress()*-30);
      let speed = (400 * this.timer.getProgress())+300; 
  
      this.chronoText.setText('⏲timer: '+TimeLeft.toString()+'s');
      let cursors = this.input.keyboard.createCursorKeys();
      
      if(pointer.isDown 
         && pointer.x>(this.player.x-(this.player.displayWidth/2)) && pointer.x<(this.player.x+(this.player.displayWidth/2))
         && pointer.x>this.player.displayWidth/2 && pointer.x<config.width-(this.player.displayWidth/2)
         && pointer.y>this.player.y-this.player.displayHeight)
      {this.player.setPosition(pointer.x, this.player.y);}
      
      if ((cursors.left.isDown || this.q.isDown) || (cursors.right.isDown || this.d.isDown)) 
      {this.player.setVelocityX(cursors.left.isDown || this.q.isDown ? -270 : 270);}
      else 
      {this.player.setVelocityX(0);}
    
      this.obstacle.setVelocityY(speed);
      
      if(this.obstacle.y > config.height+(this.obstacle.displayWidth/2))
      {this.obstacle.setPosition(RandInt(this.obstacle.displayWidth/2,config.width - (this.obstacle.displayWidth/2)), -50);}
      
      if(TimeLeft==0)
      {WinOrLose='Win';}
        
      if(WinOrLose == 'lose' || WinOrLose == 'Win')
      {
        if(WinOrLose == 'lose')
        {this.winText.setText('You lose');}
        if(WinOrLose == 'Win')
        {this.winText.setText('You Win !🏆');} 
        pause = true;
        this.obstacle.setVelocityY(0);
        this.player.setVelocityX(0);
        this.obstacle.setPosition(RandInt(this.obstacle.displayWidth/2,config.width - (this.obstacle.displayWidth/2)), -50);
        this.player.setPosition(config.width / 2, config.height - (this.player.displayHeight/2));
      }
      
      
      
      if(WinOrLose == null)
      {
        this.winText.setText(); 
      }
    }
}

function onEvent()
  {console.log('time out');}

function RandInt(min, max)
{
  Math.round(min);
  Math.round(max);
  return Math.random() * (max - min) + min;
}



function reset(PauseOrNot)
  {
    pause = PauseOrNot;
    this.obstacle.setVelocityY(0);
    this.player.setVelocityX(0);
    this.obstacle.setPosition(RandInt(this.obstacle.displayWidth/2,config.width - (this.obstacle.displayWidth/2)), -50);
    this.player.setPosition(config.width / 2, config.height - (this.player.displayHeight/2));
  }


const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 550,
    //autoCenter: true,
    backgroundColor: '#020E55',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 0
            },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);