import {gameListLoop, joinSiriusGame, signout, registerLobbyCallbacks} from './sirius-api';

import {createApp} from "vue";
import Lobby from "./Lobby.vue";
let root
const app = createApp(Lobby);

window.addEventListener("load", () => {
    root = app.mount("#game-list");
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
    root.refreshGames(list);
    console.log(list);
}

/**
 * Fonction automatiquement appelée 1 fois, permettant d'avoir des informations sur votre personnage
 * @param {*} data du joueur (sa classe, son nom, son niveau, etc)
 */
const playerInfo = data => {
    document.querySelector("#hero").innerHTML = data.username;
    document.querySelector("#hero-points").innerHTML = "( "+ data.type + " de niveau "
    + data.level + ", points à dépenser : " + (parseInt(data.unspent_points) + parseInt(data.unspent_skills)) + " )";
}
