import {registerGameCallbacks,  gameLoop} from './sirius-api';
import Wizard from "./Objects/Wizard";
import Warrior from "./Objects/Warrior";
import Healer from "./Objects/Healer";
import Executioner from "./Objects/Executioner";

/** SpriteList of all the players */
let spriteList = [];
/** SpriteList of the boss */
let bossSprite = null;

/** List of all others connected players with their name*/
let connectedPlayers = [];

/** Contains the name of the current map */
let map = "Eversong";

// Game initialization after load.
window.addEventListener("load", () => {
    // Get the node for the attack buttons
    let nodeAttack1 = document.querySelector("#attack-1");
    let nodeAttack2 = document.querySelector("#attack-2");
    let nodeAttack3 = document.querySelector("#attack-3");

    registerGameCallbacks(gameUpdate, gameOverCallback, attackCallback,
        nodeAttack1, nodeAttack2, nodeAttack3);

    gameLoop();

    changeBackground(map);

    spawnBoss();
    spawnMainPlayer();

    tick();
});

// *** FONCTION D'AFFICHAGE *** //

const changeBackground = (map) => {
    let bgPath = "../../background/" + map + ".jpg";

    let mapDiv = document.querySelector("#game");
    mapDiv.style.backgroundImage = "url(" + bgPath + ")";

    mapDiv.style.width = "100vw";
    mapDiv.style.height = "100vh";

    mapDiv.style.backgroundPosition = "center";
    mapDiv.style.backgroundSize = "100vw 100vh";
}

// *** FONCTIONS DE SPRITES *** //
/**Spawns the main player, needs to be initialized before the other players.*/
const spawnMainPlayer = () => {
    spriteList.push(new Healer("Wyllas"));
    initializeLocation(spriteList[0]);
}

const spawnOtherPlayer = player => {
    let type = player.type;
    let name = player.name;
    let id = connectedPlayers.length;

    console.log();

    let nodeMessage = document.querySelector("#message");
    let messageDiv = document.createElement("div");
    messageDiv.id = name;
    messageDiv.innerHTML = name + " a rejoint la partie";
    messageDiv.className = "container";
    console.log(id);
    if(player.welcome_text != null)
        messageDiv.innerHTML += " et il a quelque chose à nous dire:" + player.welcome_text;
    nodeMessage.appendChild(messageDiv);
    messageDiv.style.zIndex = 3;
    messageDiv.style.marginTop = "10px";

    setTimeout(() => {
        nodeMessage.removeChild(messageDiv);
    }, 10000);

    if (type === "Melee") {
        spriteList.push(new Warrior(name, id));
    }
    else if (type === "Heal") {
        spriteList.push(new Healer(name, id));
    } else if (type === "Ranged") {
        spriteList.push(new Wizard(name, id));
    } else if (type === "Magic") {
        spriteList.push(new Wizard(name, id));
    }
    initializeLocation(spriteList[spriteList.length - 1]);

}

const disconnectPlayer = player => {
    let index = connectedPlayers.indexOf(player);
    connectedPlayers.splice(index, 1);
    spriteList[index+1].isAlive = false;
}

/** Spawns the boss */
const spawnBoss = () => {
    bossSprite = new Executioner();
}

/** Initialize player location depending on location of the player sent.
 * This version is for the game start. Use characters fonction for after
 * the game has started.
 *
 * @param sprite Sprite that needs to be initialized*/
const initializeLocation = (sprite) => {
    console.log("Initializing location for " + sprite.name);
    let margin = 50;
    sprite.move( sprite.position.x - margin, sprite.position.x).then(() => {
    });
}

/** *** Game function ***

Usually linked to the API and the game logic.
*/

const tick = () => {
    spriteList.forEach(sprite => {
        if(!sprite.tick()){
            // Remove the sprite from the list and delete it from the HMTL
            let index = spriteList.indexOf(sprite);
            let name = sprite.name;
            let node = document.getElementById(name);
            let barNode = document.getElementById(name + "_bar");
            barNode.parentNode.removeChild(barNode);
            node.parentNode.removeChild(node);
            spriteList.splice(index, 1);
        }
    });

    bossSprite.tick();
    requestAnimationFrame(tick);
}

/**
 * Fonction appelée automatiquement lorsque vous attaquez.
 *
 * @param {*} skill utilisé
 */
const attackCallback = skill => {
    if (skill.name === 'Normal')
        spriteList[0].action1(bossSprite);
    else if (skill.name === "Special1"){
        spriteList[0].action2(bossSprite);}
    else if (skill.name === "Special2")
        spriteList[0].action3(bossSprite);
}

/**
 * Fonction appelée automatiquement à chaque 2 secondes, qui inclut les informations de la partie en cours
 * @param {*} game : information de la partie (si game.attacked est à true, c'est que l'ennemi vient d'attaquer)
 * @param {*} player : information du joueur
 * @param {*} otherPlayers : information sur les autres joueurs présent dans la partie
 */
const gameUpdate = (game, player, otherPlayers)  => {
    let otherPlayersNameMap = otherPlayers.map(player => player.name);

    connectedPlayers.forEach(player => {
        if(!otherPlayersNameMap.includes(player)){
            console.log("Player " + player + " has disconnected");
            disconnectPlayer(player);
        }
    });

    for (player of otherPlayers) {
        if (!connectedPlayers.includes(player.name)) {
            connectedPlayers.push(player.name);
            spawnOtherPlayer(player);
        }
        if (player.attacked !== "--") {
            filterPlayerAction(player.attacked, connectedPlayers.indexOf(player.name) + 1);
        }
    }
    spriteList[0].updatebars(
        [player.hp, player.max_hp],
        [player.mp, player.max_mp]);

    bossSprite.updatebars([game.hp, game.max_hp]);

    for (let i = 1; i < spriteList.length; i++) {
        if (spriteList[i].isAlive) {
            spriteList[i].updatebars(
                [otherPlayers[i - 1].hp, otherPlayers[i - 1].max_hp],
                [otherPlayers[i - 1].mp, otherPlayers[i - 1].max_mp]);
        }
    }

    if(game.attacked != null && game.attacked !== false){
        bossSprite.simpleAttack("attack").then(() => {});
    }
}
/**
 * Fonction appelée automatiquement lorsque la partie se termine. Vous devez afficher un message à l'écran,
 * puis faire en sorte que le joueur puisse retourner à la page lobby.html
 * @param {*} msg de fin de partie
 */
const gameOverCallback = msg => {
    let div = document.querySelector("#game");
    div.classList.add("flex");
    div.classList.add("center");
    div.classList.add("column");
    div.classList.add("gameOver");
    if (msg === "GAME_NOT_FOUND_WIN") {
        win(div);
    } else if (msg === "GAME_NOT_FOUND_LOST") {
        lost(div);
    }
    gameOver(div);
}

/* *** TOOLS *** */
/** Filters the action of a player and calls the corresponding function.
 * Some kind of primitive function wrapper I guess*/
const filterPlayerAction = (attack, id) => {
    if (attack === "Normal") {
        spriteList[id].action1();
    } else if (attack === "Special1") {
        spriteList[id].action2();
    } else if (attack === "Special2") {
        spriteList[id].action3();
    }
}

const win = node => {
    node.classList.add("win");
    node.innerHTML = "<h1>You have won !</h1>";
}

const lost = node => {
    node.classList.add("lost");
    node.innerHTML = "<h1>You have lost !</h1>";
}

const gameOver = node => {
    let htmlIndex = "lobby.html"; // Todo: change this to the lobby page
    node.innerHTML += "<a href=" + htmlIndex + ">Retour au menu principal</a>";
}



