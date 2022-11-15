import {registerGameCallbacks,  gameLoop} from './sirius-api';

window.addEventListener("load", () => {
    let nodeAttack1 = document.querySelector("#attack-1");
    let nodeAttack2 = document.querySelector("#attack-2");
    let nodeAttack3 = document.querySelector("#attack-3");
    registerGameCallbacks(gameUpdate, gameOverCallback, attackCallback, nodeAttack1, nodeAttack2, nodeAttack3);
    gameLoop();
})

/**
 * Fonction appelée automatiquement lorsque vous attaquez.
 *
 * @param {*} skill utilisé
 */
const attackCallback = skill => {
    console.log("You attacked !" , skill);
}

/**
 * Fonction appelée automatiquement lorsque la partie se termine. Vous devez afficher un message à l'écran,
 * puis faire en sorte que le joueur puisse retourner à la page lobby.html
 * @param {*} msg de fin de partie
 */
const gameOverCallback = msg => {
    console.log(msg);
}

/**
 * Fonction appelée automatiquement à chaque 2 secondes, qui inclut les informations de la partie en cours
 * @param {*} game : information de la partie (si game.attacked est à true, c'est que l'ennemi vient d'attaquer)
 * @param {*} player : information du joueur
 * @param {*} otherPlayers : information sur les autres joueurs présent dans la partie
 */
const gameUpdate = (game, player, otherPlayers)  => {
    document.querySelector("#enemy-life").innerHTML = game.hp + "/" + game.max_hp;
    document.querySelector("#your-life").innerHTML = player.hp + "/" + player.max_hp;
    console.log(game);
    console.log(player);
    console.log(otherPlayers);
}
