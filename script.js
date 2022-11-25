
var timer;
var chrono;
var win;
var WinOrLose;
var pause = false;

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('obstacle', 'assets/rock.png');
    this.load.image('background', 'assets/background.png')
}

function create() {
    this.q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.add.image(config.width/2,config.height/2,'background').setScale(config.width/240, config.height/320);
    this.player = this.physics.add.image(config.width / 2, config.height - 50, 'player').setScale(0.04, 0.04);
    this.obstacle = this.physics.add.image(config.width / 2, 50, 'obstacle').setScale(0.03, 0.03);
    this.player.setCollideWorldBounds(true);
    this.player.setImmovable(true);
    this.obstacle.setImmovable(true);

    this.chrono = this.add.text(10,10,'chrono',{font: '16px arial',fill :'#dddddd', stroke:'#000000',strokeThickness:5});
    this.win = this.add.text(config.width / 3, 75, '', {font: '20px arial',fill :'#eeee00', stroke:'#222222',strokeThickness:6});

    this.timer = this.time.delayedCall(30000,onEvent,null,this);
}

function update() {
    
    if(this.r.isDown)
    {
      pause=false;
      WinOrLose = null;
      this.timer = this.time.delayedCall(30000,onEvent,null,this);
      this.obstacle.setVelocityY(0);
      this.player.setVelocityX(0);
      this.obstacle.setPosition(RandInt(25,config.width-50), -50);
      this.player.setPosition(config.width / 2, config.height - 50);
      let currentTime = 30+this.timer.getProgress()*-1;
    }
  
    if(pause==false)
    {
      let currentTime = Math.trunc(30+this.timer.getProgress()*-30);
      let speed = (350 * this.timer.getProgress())+200; 
  
      this.chrono.setText('⏲timer: '+currentTime.toString()+'s');
      let cursors = this.input.keyboard.createCursorKeys();
      if ((cursors.left.isDown || this.q.isDown) || (cursors.right.isDown || this.d.isDown)) 
      {this.player.setVelocityX(cursors.left.isDown || this.q.isDown ? -270 : 270);}
      else 
      {this.player.setVelocityX(0);}
    
      this.obstacle.setVelocityY(speed);
      
      this.physics.add.collider
      (
          this.player,
          this.obstacle,
          function(_player,_obstacle,_win)
        {
          if(_player.body.touching.up && _obstacle.body.touching.down
             || _player.body.touching.left && _obstacle.body.touching.right
             || _player.body.touching.right && _obstacle.body.touching.left)
          {
            WinOrLose = 'lose';
          }
        }
      );
      if(this.obstacle.y > config.height)
      {this.obstacle.setPosition(RandInt(25,config.width-50), -50);}
      if(currentTime==0)
      {WinOrLose='Win';}
        
      if(WinOrLose == 'lose')
      {
        this.win.setText('You lose');  
        pause = true;
        this.obstacle.setVelocityY(0);
        this.player.setVelocityX(0);
        this.obstacle.setPosition(RandInt(25,config.width-50), -50);
        this.player.setPosition(config.width / 2, config.height - 50);
      }
      if(WinOrLose == 'Win')
      {
        this.win.setText('You Win !🏆');  
        pause = true;
        this.obstacle.setVelocityY(0);
        this.player.setVelocityX(0);
        this.obstacle.setPosition(RandInt(25,config.width-50), -50);
        this.player.setPosition(config.width / 2, config.height - 50);
      }
      if(WinOrLose == null)
      {
        this.win.setText(); 
      }
    }
 
}

function onEvent()
  {console.log('time out');}

function RandInt(min, max)
{
  return Math.random() * (max - min) + min;
}

function reset(PauseOrNot)
  {
    pause = PauseOrNot;
    this.obstacle.setVelocityY(0);
    this.player.setVelocityX(0);
    this.obstacle.setPosition(RandInt(25,config.width-50), -50);
    this.player.setPosition(config.width / 2, config.height - 50);
  }


const config = {
    type: Phaser.AUTO,
    width: 350,
    height: 500,
    autoCenter: true,
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