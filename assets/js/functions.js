// Game Functions

/// -------------------------------------///
///                CONTENTS:
/// - Deck Control
/// - Player Choices
/// - General Game Functions
/// - Update UI/DOM
/// -------------------------------------///


/// --- Deck Control

// Generate new deck with shuffle
function game_deck_shuffle() {
    gameData.gameDeck = array_clone(gameData.gameDeckTemplate);
    gameData.gameDeck = array_shuffle(gameData.gameDeck);
}

// Generate Player Cards
function game_generate_cards() {

    // Give Player Cards
    gameData.handPlayer.push(game_deck_draw());
    gameData.handPlayer.push(game_deck_draw());

    // Give Dealer Cards
    gameData.handDealer.push(game_deck_draw());
    gameData.handDealer.push(game_deck_draw());
}

// Return random card from game deck, remove card from deck
function game_deck_draw() {

    // Get random index left in array length
    let randomCard = getRandomInt(gameData.gameDeck.length);
    let result = gameData.gameDeck[randomCard];

    // Remove card from deck
    gameData.gameDeck.splice(randomCard, 1);

    // Return Card Pulled
    return result;
}

// Return Player/Dealer hand total value
function game_get_hand_total(hand) {

    // Holds total card value
    let handTotal = 0;

    // Loop through each card and get value
    for (let i = 0; i < hand.length; i++) {

        console.log(hand[i]);

        // Evaluate int/string from card value
        let handValue = parseInt(hand[i]);

        // Is a number, add to the total
        if (Number.isInteger(handValue)) {
            handTotal += handValue;
        }

        // Is not number, let's determine the value
        if (!Number.isInteger(handValue)) {
            if (hand[i] === "a") {
                handTotal += 11;
            }
            else {
                handTotal += 10;
            }
        }
    }

    // Ace Check Modifier
    let aceCheck = hand.includes("a");
    let tenCheck = false;
    if (hand.includes("10") || hand.includes("k") || hand.includes("q") || hand.includes("j")) {
        tenCheck = true;
    }

    if (aceCheck && handTotal > 21) {
        handTotal -= 10;
    }

    // Return Total
    return handTotal;
}

// Dealer Reveal Card
function game_dealer_reveal_cards () {

    let cardDiv = document.getElementsByClassName("card-cell")[0];
    let cardValue = gameData.handDealer[0];
    cardDiv.innerHTML = `
        <img src="assets/imgs/${cardValue}.png">
    `;

    let totalDiv = document.getElementById("data-dealer-hand-total");
    totalDiv.textContent = game_get_hand_total(gameData.handDealer);
}

/// --- Round Control

// Start Game
function game_choice_start_game() {
    game_ui_update_game_stage(1);
}

// Choose increased bet
function game_choice_bet_add() {

    // Player has sufficient funds
    if (gameData.creditsPlayer > 5) {
        game_bet_add_value(5);

        // Unlock Draw Button
        let betBtn = document.getElementById("btn-bet");
        betBtn.disabled = false;
    }

    // Player has insufficient funds
    // Trigger Alert Message
}

// Start Game Round
function game_choice_start_round() {

    // Update Game Stage
    game_ui_update_game_stage(2);

    // Clear Original Cards
    game_ui_clear_cards();

    // Update hands UI
    game_ui_update_hand(gameData.handPlayer);
    game_ui_update_hand(gameData.handDealer);

    // Update Hands UI
    game_ui_update_hand_total();

    // Check if Blackjack
    if (game_check_blackjack()) {

        // Alert Message
        game_alert_show("Blackjack! Player Wins!");
        
        // Change Alert window color (hacky)
        let alertDiv = document.getElementById("message-alert");
        alertDiv.style.backgroundColor = "#09610f";

        // Give Player Credits
        gameData.creditsPlayer += gameData.creditsBet*3;

        // Update Game Stage
        game_ui_update_game_stage(3);
    }
}


// Player Hits
function game_choice_hit() {

    // Player Had
    let hand = gameData.handPlayer

    // Add another card
    hand.push(game_deck_draw());

    // Update UI
    game_ui_update_hand(hand, true);

    // Update Hands UI
    game_ui_update_hand_total();

    // Check if busted
    if (game_check_bust()) {
        
        // Update Message
        game_alert_show("Over 21! Busted!");

        // Update Stage
        game_ui_update_game_stage(3);
    }

    // Check if Blackjack
    if (game_check_blackjack()) {
        game_player_blackjack();
    }
}

// Player stands
function game_choice_stand () {

    // CPU Checks
    let dealerHandTotal = game_get_hand_total(gameData.handDealer);
    if (dealerHandTotal < 16) {
        
        // Dealer Draw Card
        gameData.handDealer.push(game_deck_draw());

        // Update UI
        game_ui_update_hand(gameData.handDealer, true);
    }

    game_dealer_reveal_cards();
    game_get_winner();
    game_ui_update_stash();
    game_ui_update_game_stage(3);
}

/// --- Game Function

// Message Alert
function game_alert_show (message) {

    // Appear Div
    let msgDiv = document.getElementById("message-alert");
    msgDiv.style.display = "block";

    // Write New Message
    msgDiv = document.getElementById("message-value");
    msgDiv.classList.add("animated");
    msgDiv.classList.add("bounceIn");
    msgDiv.textContent = message;
}

// Clear Cards
function game_ui_clear_cards () {
    let clearStage = document.getElementById("dealer-container");
    clearStage.innerHTML = ``;
    clearStage = document.getElementById("player-container");
    clearStage.innerHTML = ``;
}

function game_get_winner () {

    // Get Totals
    let playerHandTotal = game_get_hand_total(gameData.handPlayer);
    let dealerHandTotal = game_get_hand_total(gameData.handDealer);

    // Player Wins
    if (playerHandTotal > dealerHandTotal || dealerHandTotal > 21) {
        
        // Alert Message
        game_alert_show("Player Wins!");
        
        // Change Alert window color (hacky)
        let alertDiv = document.getElementById("message-alert");
        alertDiv.style.backgroundColor = "#09610f";

        // Give Player Credits
        gameData.creditsPlayer += gameData.creditsBet*2;

    } 
    
    // Dealer Wins
    else if (playerHandTotal < dealerHandTotal) {
        
        // Alert Message
        game_alert_show("Dealer Wins!");

        // Change Alert window color (hacky)
        let alertDiv = document.getElementById("message-alert");
        alertDiv.style.backgroundColor = "#710000";
    }

    // Game is a tie
    else if (playerHandTotal === dealerHandTotal) {

        // Alert Message
        game_alert_show("Tie!");
        
        // Give back bet
        gameData.creditsPlayer += gameData.creditsBet;
    }

    // Update Stash Total
    game_ui_update_stash();
}


// Game Reset for next round
function game_reset () {

    // Reset Cards HTML
    game_ui_clear_cards();

    // Clear Bet
    gameData.creditsBet = 0;
    let betDiv = document.getElementById("data-bet");
    betDiv.textContent = gameData.creditsBet;

    // Reset Message Color
    let alertDiv = document.getElementById("message-alert");
    alertDiv.style.backgroundColor = "#96205b";

    // Clear Dealer Data Hand Total
    let totalDiv = document.getElementById("data-dealer-hand-total");
    totalDiv.textContext = "?";
    
    // Clear Player Data Hand Total
    totalDiv = document.getElementById("data-hand-total");
    totalDiv.textContent = "?";

    // Add card back placeholders
    let cardHTML = `
    <div class="card-cell">
        <img src="assets/imgs/back.png">
    </div>
    `;

    // Update Dealer HTML
    let cardDiv = document.getElementById("dealer-container");
    cardDiv.innerHTML = cardHTML+cardHTML;
    
    // Update Player
    cardDiv = document.getElementById("player-container");
    cardDiv.innerHTML = cardHTML+cardHTML;
    
    // Clear Message
    let msgDiv = document.getElementById("message-alert");
    msgDiv.style.display = "none";

    // Reset Game Stage
    game_ui_update_game_stage(1);

    // Reset Variables
    gameData.handPlayer = [];
    gameData.handDealer = [];

    // Reset Deck
    game_deck_shuffle();

    // Regenerate Cards
    game_generate_cards();
}

// Return if player is over 21
function game_check_bust() {

    // 
    if (game_get_hand_total(gameData.handPlayer) > 21) {
        return true;
    } else {
        return false;
    }
}


// Return if player is at 21
function game_check_blackjack() {
    if (game_get_hand_total(gameData.handPlayer) === 21) {
        return true;
    } else {
        return false;
    }
}


/// Playr Wins BlackJack
function game_player_blackjack () {
    
    // Check if Blackjack
    if (game_check_blackjack()) {

        // Alert Message
        game_alert_show("Blackjack! Player Wins!");
        
        // Change Alert window color (hacky)
        let alertDiv = document.getElementById("message-alert");
        alertDiv.style.backgroundColor = "#09610f";

        // Give Player Credits
        gameData.creditsPlayer += gameData.creditsBet*3;

        // Update Game Stage
        game_ui_update_game_stage(3);
    }
}
/// --- Update Deck visuals

// Update Stash Total
function game_ui_update_stash () {
    let stashDiv = document.getElementById("data-stash");
    stashDiv.textContent = gameData.creditsPlayer;
}

// Update Player Hand Totals
function game_ui_update_hand_total() {
    let handDiv = document.getElementById("data-hand-total");
    handDiv.textContent = game_get_hand_total(gameData.handPlayer);
}

// Update Hand UI
function game_ui_update_hand(hand, next) {

    // Only update last card
    let ii = 0;
    if (next === true) {
        ii = hand.length - 1;
    }

    // Loop through hand and create HTML and append
    for (i = ii; i < hand.length; i++) {
        // Determine which array to grab the hand of
        let handDiv = "";
        if (hand === gameData.handPlayer) { handDiv = "player-container"; }
        if (hand === gameData.handDealer) { handDiv = "dealer-container"; }

        let parentDiv = document.getElementById(handDiv);
        let childDiv = document.createElement("div");
        let cardImg = hand[i];

        // Dealer Hand Check - Hide first card
        if (hand === gameData.handDealer && i == 0) { cardImg = "back"; }

        // Assign card image and classes
        childDiv.innerHTML = `<img src="assets/imgs/${cardImg}.png">`;
        childDiv.classList.add("card-cell");

        // Animation: Check if card is last to be rendered and flip in
        if (i === hand.length - 1) {
            childDiv.classList.add("animated");
            childDiv.classList.add("flipInY");
        }

        // Add Divs to DOM
        parentDiv.appendChild(childDiv);
    }
}


// Player bet increase value and update UI
function game_bet_add_value(value) {

    // Subtract credits from player
    gameData.creditsPlayer -= value;

    // Add to bet pool
    gameData.creditsBet += value;

    // Update UI
    let betDiv = document.getElementById("data-bet");
    let stashDiv = document.getElementById("data-stash");

    betDiv.textContent = gameData.creditsBet;
    stashDiv.textContent = gameData.creditsPlayer;
}

// Update Game Stage
function game_ui_update_game_stage(gameStage) {

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
                <button disabled="true" id="btn-bet" class="btn-normal" onclick="game_choice_start_round()">Draw</button>
            `;
            break;

        // Hit or Stand
        case 2:
            stageHTML = `
            <button class="btn-normal" onclick="game_choice_hit()">Hit</button>
            <button class="btn-normal" onclick="game_choice_stand()">Stand</button>
            `;
            break;

        // Hit or Stand
        case 3:
            stageHTML = `
            <button class="btn-normal" onclick="game_reset()">Play Again</button>
            `;
            break;
    }

    // Update HTML
    let stageDiv = document.getElementById("game-stage");
    stageDiv.innerHTML = stageHTML;
}