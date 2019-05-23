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

// Get hand total value
function game_get_hand_total (hand) {

    // Holds total card value
    let handTotal = 0;

    // Loop through each card and get value
    for (let i = 0; i < hand.length; i++) {

        // Evaluate int/string from card value
        let handValue = parseInt(hand[i]);

        // Is a number, add to the total
        if (Number.isInteger(handValue)) {
             handTotal += handValue;
        }
        
        // Is not number, let's determine the value
        if (!Number.isInteger(handValue)) {
            handTotal += 10;
        }
    }

    // Return Total
    return handTotal;
}

/// --- Round Control

// Start Game
function game_choice_start_game () {
    game_ui_update_game_stage(1);
}

// Choose increased bet
function game_choice_bet_add () {
    
    // Player has sufficient funds
    if (gameData.creditsPlayer > 5) {
        game_bet_add_value(5);
    }

    // Player has insufficient funds
    // Trigger Alert Message
}

// Start Game Round
function game_choice_start_round () {

    // Update Game Stage
    game_ui_update_game_stage(2);

    // Clear Original Cards
    let clearStage = document.getElementById("dealer-container");
    clearStage.innerHTML = ``;
    clearStage = document.getElementById("player-container");
    clearStage.innerHTML = ``;

    // Update hands UI
    game_ui_update_hand(gameData.handPlayer);
    game_ui_update_hand(gameData.handDealer);

    // Update Hands UI
    game_ui_update_hand_total();

}

// Player Hits
function game_choice_hit () {

    // Player Had
    let hand = gameData.handPlayer
    
    // Add another card
    hand.push(game_deck_draw());
    
    // Update UI
    game_ui_update_hand(hand, true);

    // Update Hands UI
    game_ui_update_hand_total();

}

/// --- Update Deck visuals

function game_ui_update_hand_total () {
    let handDiv = document.getElementById("data-hand-total");
    handDiv.textContent = game_get_hand_total(gameData.handPlayer);
}

function game_ui_update_hand (hand, next) {

    // Generate HTML and Append

    let ii = 0;

    if (next === true) {
        ii = hand.length-1;
    }

    for (i = ii; i < hand.length; i++) {
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



function game_bet_add_value (value) {    
            
    // Subtract credits from player
    gameData.creditsPlayer -= value;

    // Add to bet pool
    gameData.creditsBet += value;

    // Update UI
    let betDiv   = document.getElementById("data-bet");
    let stashDiv = document.getElementById("data-stash");

    betDiv.textContent = gameData.creditsBet;
    stashDiv.textContent = gameData.creditsPlayer;
}

// Update Game Stage
function game_ui_update_game_stage (gameStage) {

    // Set Game Stage
    let stageHTML = "";
    switch (gameStage) {

        // Start Game
        case 0:
            stageHTML = `
                <button class="btn-normal" onclick="game_choice_start_game()">Begin Playing</button>
            `;
            break;

        // Bet or Draw
        case 1:
            stageHTML = `
                <button class="btn-normal" onclick="game_choice_bet_add()">Bet +5 Credits</button>
                <button class="btn-normal" onclick="game_choice_start_round()">Draw</button>
            `;
            break;
        
        // Hit or Stand
        case 2:
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