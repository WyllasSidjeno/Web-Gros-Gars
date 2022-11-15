import {gameListLoop, joinSiriusGame, signout, registerLobbyCallbacks} from './sirius-api';

window.addEventListener("load", () => {
    registerLobbyCallbacks(listUpdate, playerInfo);
    gameListLoop();
    document.querySelector("#signout").onclick = signout;
});

/**
 * Liste des parties du jeu. Cette fonction est appelée automatiquement à chaque 4 secondes environ.
 * Vous devrez modifier cette fonction afin d'utiliser Vue au lieu de manipuler le DOM directement.
 *
 * Chaque partie contient plusieurs informations (ex : level, name, id, etc)
 * @param {*} list de parties
 */
const listUpdate = list => {
    let gameListContainer = document.querySelector("#game-list");
    gameListContainer.innerHTML = "";

    list.forEach(game => {
        let gameNode = document.createElement("div");
        gameNode.onclick = () => joinSiriusGame(game.id, err => document.querySelector("#join-error").innerHTML = err)
        gameNode.innerHTML = game.name + "(lvl : " + game.level + ") Joueurs : " + game.nb + "/" + game.max_users;
        gameListContainer.append(gameNode);
    });
}

/**
 * Fonction automatiquement appelée 1 fois, permettant d'avoir des informations sur votre personnage
 * @param {*} data du joueur (sa classe, son nom, son niveau, etc)
 */
const playerInfo = data => {
    document.querySelector("#hero").innerHTML = data.username + "(lvl : " + data.level + ", points à dépenser : " + (parseInt(data.unspent_points) + parseInt(data.unspent_skills)) + ")";
    console.log(data);
}