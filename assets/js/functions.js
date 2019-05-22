// Game Functions

/// --- Deck Control
// Generate new deck with shuffle
function game_deck_shuffle () {
    gameData.gameDeck = array_clone(gameData.gameDeckTemplate);
    gameData.gameDeck = array_shuffle(gameData.gameDeck);
}

// Generate Player Cards
function game_generate_cards () {

    // Give Player Cards
    gameData.handPlayer.push(game_deck_draw());
    gameData.handPlayer.push(game_deck_draw());

    // Give Dealer Cards
    gameData.handDealer.push(game_deck_draw());
    gameData.handDealer.push(game_deck_draw());
}

function game_deck_draw () {
    
    // Get random index left in array length
    let randomCard = getRandomInt(gameData.gameDeck.length);
    let result     = gameData.gameDeck[randomCard];
    
    // Remove card from deck
    gameData.gameDeck.splice(randomCard, 1);

    // Return Card Pulled
    return result;
}

/// --- Round Control
// Start Game Round
function game_choice_start_round () {

    // Update Game Stage
    game_ui_update_game_stage(1);

    // Clear Original Cards
    let clearStage = document.getElementById("dealer-container");
    clearStage.innerHTML = ``;
    clearStage = document.getElementById("player-container");
    clearStage.innerHTML = ``;

    // Update UI
    game_ui_update_hand(gameData.handPlayer);
    game_ui_update_hand(gameData.handDealer);

}

/// --- Update Deck visuals

function game_ui_update_hand (hand) {

    // Generate HTML and Append
    for (let i = 0; i < hand.length; i++) {
        // Determine which array to grab the hand of
        let handDiv = "";
        if (hand === gameData.handPlayer) { handDiv = "player-container"; }
        if (hand === gameData.handDealer) { handDiv = "dealer-container"; }

        let parentDiv = document.getElementById(handDiv);
        let childDiv  = document.createElement("div");
        let cardImg   = hand[i];
        
        // Dealer Hand Check - Hide first card
        if (hand === gameData.handDealer && i == 0) { cardImg = "back"; }
        
        // Assign card image and classes
        childDiv.innerHTML = `<img src="/assets/imgs/${cardImg}.png">`;
        childDiv.classList.add("card-cell");
    
        // Animation: Check if card is last to be rendered and flip in
        if (i === hand.length-1) {
            childDiv.classList.add("animated");
            childDiv.classList.add("flipInY");
        }

        // Add Divs to DOM
        parentDiv.appendChild(childDiv);
    }
}


function game_ui_update_game_stage (gameStage) {

    // Set Game Stage
    let stageHTML = "";
    switch (gameStage) {

        // Start Game
        case 0:
            stageHTML = `
                <button class="btn-normal" onclick="game_choice_bet_add()">Bet +5 Credits</button>
                <button class="btn-normal" onclick="game_choice_start_round()">Draw</button>
            `;
            break;

        case 1:
            stageHTML = `
            <button class="btn-normal" onclick="game_choice_hit()">Hit</button>
            <button class="btn-normal" onclick="game_choice_stand()">Stand</button>
            `;
            break;
    }

    // Update HTML
    let stageDiv = document.getElementById("game-stage");
    stageDiv.innerHTML = stageHTML;
}