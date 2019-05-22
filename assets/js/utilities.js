// JS Utilities

// --- ARRAYS

// Clone Array
function array_clone (array) {
    return array.slice(0);
}

// Randomly Shuffle Array
function array_shuffle (array) {
    return array.sort(function(a, b) { return 0.5 - Math.random() });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}