const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;

function preload(){
  bg=loadImage("background.png")
  melon=loadImage("melon.png")
  rabbit=loadImage("Rabbit-01.png")
  blink=loadAnimation("blink_1.png","blink_2.png","blink_3.png")
  eat=loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png","eat_4.png")
  sad=loadAnimation("sad_1.png","sad_2.png","sad_3.png")
  blink.playing=true
  eat.playing=true
  sad.playing=true
  eat.looping=false
  sad.looping=false
  bgsound=loadSound("sound1.mp3")
  sadsound=loadSound("sad.wav")
  cutsound=loadSound("rope_cut.mp3")
  eatsound=loadSound("eating_sound.mp3")
  airsound=loadSound("air.wav")
}
function setup() 
{
  var isMobile=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  if(isMobile){
    w=displayWidth
    h=displayHeight
  
    createCanvas(w,h)
  }
  else{
    w=windowWidth
    h=windowHeight
    createCanvas(w-10,h-10)
  }
  frameRate(80);
  engine = Engine.create();
  world = engine.world;

  bgsound.play()
  bgsound.setVolume(0.5)
  rope=new Rope(8,{x:w/2-220,y:h/2-190})
  rope2=new Rope(6,{x:w/2+30,y:h/2-290})
  rope3=new Rope(8,{x:w/2+330,y:h/2-40})

  watermelon=Bodies.circle(100,100,20)
  Composite.add(rope.body,watermelon)
  
  blink.frameDelay=10
  eat.frameDelay=20
  sad.frameDelay=20
  ground = new Ground(200,h,1000,20);

  connection=new Connection(rope,watermelon)
  connection2=new Connection(rope2,watermelon)
  connection3=new Connection(rope3,watermelon)
  
  bunny=createSprite(w/4,h-100)
  bunny.addAnimation("blinking",blink)
  bunny.addAnimation("eating",eat)
  bunny.addAnimation("crying",sad)
  bunny.scale=0.25

  button1=createImg("cut_btn.png")
  button1.position(w/2-250,h/2-200)
  button1.size(50,50)
  button1.mouseClicked(drop1)

  button2=createImg("cut_btn.png")
  button2.position(w/2,h/2-300)
  button2.size(50,50)
  button2.mouseClicked(drop2)

  button3=createImg("cut_btn.png")
  button3.position(w/2+300,h/2-50)
  button3.size(50,50)
  button3.mouseClicked(drop3)

  mute=createImg("mute.png")
  mute.position(w-100,20)
  mute.size(50,50)
  mute.mouseClicked(mutesound)

  balloon=createImg("balloon.png")
  balloon.position(10,250)
  balloon.size(150,100)
  balloon.mouseClicked(pushBalloon)

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50)
  
}

function draw() 
{
  background(bg);
  ground.show();
  rope.show()
  rope2.show()
  rope3.show()
  Engine.update(engine);
  
  imageMode(CENTER)
 
  if(watermelon!=null){
    image(melon,watermelon.position.x,watermelon.position.y,70,70)
  }
  
  if(fruitCollision(watermelon,bunny)==true){
    bunny.changeAnimation("eating")
    eatsound.play()
  }
  if(watermelon!=null&&watermelon.position.y>=h-30){
    bunny.changeAnimation("crying")
    bgsound.stop()
    sadsound.play()
  }
  drawSprites()
   
}
function drop1(){
  cutsound.play()
  rope.break()
  connection.detach()
  connection=null
}
function drop2(){
  cutsound.play()
  rope2.break()
  connection2.detach()
  connection2=null
}
function drop3(){
  cutsound.play()
  rope3.break()
  connection3.detach()
  connection3=null
}

function fruitCollision(body,sprite){
  if(body!=null){
    var d=dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y)
    if(d<=80){
      World.remove(world,watermelon)
      watermelon=null
      return true
    }
    else{
      return false
    }
  }
}
function mutesound(){
  if(bgsound.isPlaying()){
    bgsound.stop()
  }
  else{
    bgsound.play()
  }
}
function pushBalloon(){
  Matter.Body.applyForce(watermelon,watermelon.position,{x:0.01,y:0})
  airsound.play()
}