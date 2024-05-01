// active sprite controls

function movement() {
  if (me.role_keeper.role === 'player2' && turnKeeper.getCurrentTurn() === me.role_keeper.role) {
    if (kb.presses('left')) p2Sprite.velocity.x = -spd;
    else if (kb.presses('right')) p2Sprite.velocity.x = spd;

    // if (kb.presses('up')) p2Sprite.velocity.y = -spd;
    // else if (kb.presses('down')) p2Sprite.velocity.y = spd;

    // p1Sprite.draw = function () {
    //   image(images.p1, 0, 0, 52, 44);
    //   // gBlob.rotation = -90;
    // }
    // p2Sprite.draw = function () {
    //   ellipse(0, 0, 52, 52);
    //   image(images.p2, 0, 0, 52, 44);
    // }
  }

  if (me.role_keeper.role === 'player1' && turnKeeper.getCurrentTurn() === me.role_keeper.role) {
    if (kb.presses('left')) p1Sprite.velocity.x = -spd;
    else if (kb.presses('right')) p1Sprite.velocity.x = spd;
    // else gBlob.velocity.x = 0;

    // if (kb.presses('up')) p1Sprite.velocity.y = -spd;
    // else if (kb.presses('down')) p1Sprite.velocity.y = spd;
    // else gBlob.velocity.y = 0;

    // p1Sprite.draw = function () {
    //   ellipse(0, 0, 52, 52);
    //   image(images.p1, 0, 0, 52, 44);
    //   // gBlob.rotation = -90;
    // }
    // p2Sprite.draw = function () {
    //   image(images.p2, 0, 0, 52, 44);
    // }
  }
}