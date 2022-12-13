var timer;
var chronoText;
var winText;
var WinOrLose;
var timeMax = 60;
var pause = false;

function preload() {
    this.load.image('player', 'assets/image/player.png');
    this.load.image('obstacle', 'assets/image/rock.png');
    this.load.image('background', 'assets/image/background.png');
    this.load.image('resetbutton', 'assets/image/reset.png');
    
    this.load.audio('win','assets/sound/win.mp3');
    this.load.audio('fail','assets/sound/fail.mp3');
    this.load.audio('musicBG', 'assets/sound/musicBG.mp3');
}

function create() {
    var music = this.sound.add('musicBG',
    {
      mute: false,
      volume: 1,
      loop: true,
      delay: 1
    });
    this.q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    this.background = this.physics.add.image(config.width/2,config.height/2,'background');
    this.background.setScale(config.width/this.background.width, config.height/this.background.height);

    this.resetbutton = this.physics.add.image(0,0,'resetbutton').setScale(0.1,0.1);
    this.resetbutton.setPosition(config.width-(this.resetbutton.displayWidth/2)-5,(this.resetbutton.displayHeight/2)+5);
    
    this.player = this.physics.add.image(config.width / 2, 0, 'player').setScale(0.04, 0.04);
    this.player.setPosition(config.width / 2, config.height - (this.player.displayHeight/2));
    this.obstacle = this.physics.add.image(config.width / 2, 50, 'obstacle').setScale(0.05, 0.05);
    this.player.setCollideWorldBounds(true);
    this.player.setImmovable(true);
    this.obstacle.setImmovable(true);

    this.chronoText = this.add.text(10,10,'chrono',
    {fontfamily:"Passion-Regu",fill:'#dddddd',stroke:'#000000',strokeThickness:5});
    this.winText = this.add.text(config.width/3,75,'',
    {fontfamily:"Passion-Regu",fill:'#eeee00',stroke:'#222222',strokeThickness:6});

    this.timer = this.time.delayedCall(30000,null,null,this);

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

function update() 
{
    var pointer = this.input.activePointer;
  
    if(this.r.isDown || pointer.isDown
      && pointer.x > this.resetbutton.x-(this.resetbutton.displayWidth/2)
      && pointer.x < this.resetbutton.x+(this.resetbutton.displayWidth/2)
      && pointer.y > this.resetbutton.y-(this.resetbutton.displayHeight/2)
      && pointer.y < this.resetbutton.y+(this.resetbutton.displayHeight/2))
    {
      pause=false;
      WinOrLose = null;
      this.timer = this.time.delayedCall(30000,null,null,this);
      this.obstacle.setVelocityY(0);
      this.player.setVelocityX(0);
      this.obstacle.setPosition(RandInt(this.obstacle.displayWidth/2,config.width - (this.obstacle.displayWidth/2)), -50);
      this.player.setPosition(config.width / 2, config.height - (this.player.displayHeight/2));
      let TimeLeft = timeMax;
    }
  
    if(pause==false)
    {
      this.obstacle.angle +=0.25;
      let TimeLeft = Math.trunc(timeMax+this.timer.getProgress()*-timeMax);
      let speed = (200 * this.timer.getProgress())+200; 
      
      let text = '⏲timer: '+TimeLeft.toString()+'s';
      //let debugtext = speed;text += debugtext;
      this.chronoText.setText(text);
      
      let cursors = this.input.keyboard.createCursorKeys();
      
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
        {
          this.winText.setText('You lose');
          this.sound.play('win',{volume:1});
        }
        if(WinOrLose == 'Win')
        {
          this.winText.setText('You Win !🏆');
          this.sound.play('fail',{volume:1});
        } 
        pause = true;
        this.obstacle.setVelocityY(0);
        this.player.setVelocityX(0);
        this.obstacle.setPosition(RandInt(this.obstacle.displayWidth/2,config.width - (this.obstacle.displayWidth/2)), -50);
        this.player.setPosition(config.width / 2, config.height - (this.player.displayHeight/2));
      }
      
      if(WinOrLose == null)
      {this.winText.setText();}
    }
}

function RandInt(min, max)
{
  Math.round(min);
  Math.round(max);
  return Math.random() * (max - min) + min;
}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 550,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
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