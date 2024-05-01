function roles() {
    fill(255);
    let y = 80;
  
    for (const guest of guests) {
      text(guest.role_keeper.role, 10, y);
      // if (guest === me) text("<- you", 100, y);
      if (turnKeeper.getCurrentTurn() === guest.role_keeper.role)
        text("⬅️", 50, y);
      y += 20;
    }
  
    // text(`You are: ${me.role_keeper.role}`, 10, height - 60);
    // // text(`Current Turn: ${turnKeeper.getCurrentTurn()}`, 10, height - 40);
    // if (turnKeeper.getCurrentTurn() === me.role_keeper.role)
    //   text("Its your turn. Click once to stick!", 10, height - 40);
    // else
    //   text("Wait for your turn...", 10, height - 40);
  };