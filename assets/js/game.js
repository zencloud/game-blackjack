// Lion Blackjack Game

// Game Data Object
const gameData = {

    // Decks
    gameDeckTemplate: [
        "a", "a", "a", "a",
        "k", "k", "k", "k",
        "q", "q", "q", "q",
        "j", "j", "j", "j",
        "10", "10", "10", "10",
        "9", "9", "9", "9",
        "8", "8", "8", "8",
        "7", "7", "7", "7",
        "6", "6", "6", "6",
        "5", "5", "5", "5",
        "4", "4", "4", "4",
        "3", "3", "3", "3",
        "2", "2", "2", "2",
    ],

    gameDeck: null,

    // Game States
    playerInputAllowed: true,
    
    // Hands
    handPlayer: [],
    handDealer: [],
}

// Shuffle Game Deck
game_deck_shuffle();

// Generate Cards
game_generate_cards();

// Update Player UI
//game_ui_update_hand(gameData.handPlayer);
//game_ui_update_hand(gameData.handDealer);
game_ui_update_game_stage(0);