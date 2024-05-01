const images = {};

const PLAYING_DURATION = 5000;

let isItPlayer2sTurn = false;
let spd = 5;
let p1sharedX, p1sharedY, guests, me;
let turnKeeper;

let initialX, finalX;
let guardSpeed = 0.5;
let guardDirection = 1;

const PLAYER_SIZE = 48;

let animIndex = 0;
let frameNo = 0;
let animSpeed = 0.1;

function preload() {
  partyConnect(
    "wss://demoserver.p5party.org",
    "heist-escape-1"
  );

  // the game crashes when i load them in the same shared object so had to split them

  p1sharedX = partyLoadShared("p1sharedX", { x: 385 });
  p1sharedY = partyLoadShared("p1sharedY", { y: 277 });
  p2sharedX = partyLoadShared("p2sharedX", { x: 500 });
  p2sharedY = partyLoadShared("p2sharedY", { y: 277 });

  freezeStates = partyLoadShared("freezeStates", { p1: { x: 385, y: 277 }, p2: { x: 500, y: 277 } });

  guardShared = partyLoadShared("guards", [
    // { x: 338, y: 880, direction: 1, initialX: 290, finalX: 339 },
    { x: 338, y: 880, direction: 1, initialX: 290, finalX: 339, waitingSince: 0, detected: false },
    { x: 608, y: 1148, direction: 1, initialX: 586, finalX: 656, waitingSince: 0, detected: false },
    { x: 320, y: 1574, direction: 1, initialX: 320, finalX: 425, waitingSince: 0, detected: false },
    { x: 600, y: 1980, direction: 1, initialX: 600, finalX: 701, waitingSince: 0, detected: false },
    { x: 350, y: 1980, direction: 1, initialX: 300, finalX: 401, waitingSince: 0, detected: false },
    { x: 460, y: 2428, direction: 1, initialX: 460, finalX: 540, waitingSince: 0, detected: false }
  ]);

  shared = partyLoadShared("globals", {
    gameState: "playing", // intro, playing
    startTime: Date.now(),
    displayTime: 5,
    detected: false,
  });

  me = partyLoadMyShared();
  guests = partyLoadGuestShareds();

  new RoleKeeper(["player1", "player2"], "observer")
  turnKeeper = new TurnKeeper(["player1", "player2"]);

  images.foxHold = loadImage('images/foxhold.png');
  images.foxHang = loadImage('images/foxhang.png');
  images.raccoonHold = loadImage('images/racchold.png');
  images.raccoonHang = loadImage('images/racchang.png');
  
  images.dogWalk1 = loadImage('images/dog1.png');
  images.dogWalk2 = loadImage('images/dog2.png');
  images.dogWalkBack1 = loadImage('images/dogback1.png');
  images.dogWalkBack2 = loadImage('images/dogback2.png');
  images.flash = loadImage('images/flash.png');
  images.flashBack = loadImage('images/flashback.png');

  images.building = loadImage('images/building.png');
  images.sky = loadImage('images/sky.png');
}

function setup() {
  let canvas = createCanvas(1000, 1000);
  canvas.parent('holder');

  noStroke();

  world.gravity.y = 10;

  // p1Sprite = new Sprite(385, 277, PLAYER_SIZE, PLAYER_SIZE, 'k');
  p1Sprite = new Sprite(500, 377, PLAYER_SIZE, PLAYER_SIZE, 'k');
  p2Sprite = new Sprite(500, 277, PLAYER_SIZE, PLAYER_SIZE, 'k');

  building = new Group();
  building.collider = 'n';
  // building.color = 'Gainsboro';
  building.color = 'none';

  building.opacity = 0;

  floor1 = new building.Sprite(500, 603, 360, 602);
  floor2 = new building.Sprite(434, 1038, 336, 268);
  floor3 = new building.Sprite(500, 1318, 360, 292);
  floor4 = new building.Sprite(565, 1531, 230, 134);
  floor5 = new building.Sprite(500, 1663, 360, 130);
  floor6 = new building.Sprite(500, 1866, 152, 276);
  floor7 = new building.Sprite(500, 2051, 452, 94);
  floor8 = new building.Sprite(340, 2275, 132, 354);
  floor9 = new building.Sprite(660, 2275, 132, 354);
  floor10 = new building.Sprite(500, 2659, 584, 414);

  security = new Group();
  security.collider = 'k';

  guard1 = new security.Sprite(1, 1, 48, 48);
  guard2 = new security.Sprite(1, 1, 48, 48);
  guard3 = new security.Sprite(1, 1, 48, 48);
  guard4 = new security.Sprite(1, 1, 48, 48);
  guard5 = new security.Sprite(1, 1, 48, 48);
  guard6 = new security.Sprite(1, 1, 48, 48);

  p1Sprite.layer = 3;
  p2Sprite.layer = 3;
  building.layer = 2;
  security.layer = 2;

  security.overlaps(p1Sprite);
  security.overlaps(p2Sprite);

  // for (let i = 0; i < guardShared.length; i++) {
  //   guardShared[i].initialX = guardShared[i].x - 48;
  //   guardShared[i].finalX = guardShared[i].x + 48;
  // }

  for (let i = 0; i < security.length; i++) {
    security[i].addCollider(150, 0, 200);
  }

  joint = new DistanceJoint(p1Sprite, p2Sprite);
  rope = new RopeJoint(p1Sprite, p2Sprite);
  joint.offsetA.y = 25;

  joint.springiness = 0.75;
  joint.damping = 0.9;

  rope.maxLength = 300;  // maximum distance between p1Sprite and p2Sprite
  //rope.minLength = 50;
}

function draw() {
  frameRate(30);
  clear();

  // background('#010014');
  background('white');
  
  push();
  textSize(32);
  text((mouseX + ", " + mouseY), 10, 50);
  pop();
  
  camera.on();
  // camera.y = 500;
  // camera.zoom = 1.5;
  
  moveCamera();
  
  image(images.sky, -25, camera.y - 525, 1050, 1050);
  image(images.building, 208, 302);

  animIndex += animSpeed;
  frameNo = Math.floor(animIndex) % 2;

  // console.log(frameNo);

  roles();
  // if (partyIsHost()) manageTimer();
  if (me.role_keeper.role === 'player1') manageTimer();

  handleGameState();

  // push();
  // textSize(32);
  // text(shared.displayTime, width - 50, 50);
  // pop();

}

function manageTimer() {

  // let elapsed = Date.now() - shared.startTime;
  // shared.displayTime = floor((PLAYING_DURATION - elapsed) / 1000) + 1;
  // if (elapsed > PLAYING_DURATION) {
  // swapTurns();
  shared.startTime = Date.now();
  // }

}

function moveCamera() {
  let cameraPos = (p1Sprite.position.y + p2Sprite.position.y) / 2;
  // round to the nearest multiple of 250
  cameraPos = Math.round(cameraPos / 250) * 250;
  camera.moveTo(500, cameraPos, 10);
  if (cameraPos < 500) {
    camera.y = 500;
  }
}