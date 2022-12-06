# **Sirius** *: Adventure Heroes.*
## **Acceuil**
L'acceuil sert majoritairement à se connecter au serveur de jeu en utilisant du [HTML](#indexhtml) ainsi que du [JavaScript](#page-indexjs) et l'API du serveur Sirius. L'utilisateur sera invité à entrer son mot de passe ainsi que son nom d'utilisateur afin de s'y connecter.
### **index.html**
Le fichier HTML de l'acceuil nécessite l'importation de [page-index.js](#page-indexjs). Cette page créé la structure nécessaire à l'affichage de la page. Celle-ci sera ensuite modifié par le Javascript afin de le rendre plus dynamique et interactif.

Les éléments HTML les plus importants qui y figurent sont les suivants :
- form -> Celle ci permettra de créer un formulaire HTML a partir des informations fournis par le client.
- input -> Il y en a deux. 
    - Mot de passe
    - Nom d'utilisateur
- button -> Permet d'envoyer le formulaire à la demande de l'user

<details>
<summary>HTML</summary>

```HTML
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accueil</title>
        <script src="dist/index.js"></script>
        <link rel="stylesheet" href="css/global.css">
        <link rel="icon" href="img/favicon.png" type="image/png" />
    </head>
    <body id="index">
        <div class="flex center">
            <div class="sign-in-input-group container header">
                <form action="" method="post" autocomplete="off">
                    <div id ="title">Adventure Heroes</div>
                    <div>Nom d'utilisateur :</div>
                    <input type="text" name="username" placeholder="Nom d'usager" required>
                    <div>Mot de passe :</div>
                    <input type="password" name="password" placeholder="Mot de passe" required>
                    <div>
                        <button class="button">Connexion</button>
                        <button id="sign-up" class="button">Créer un compte</button>
                    </div>
                    <div id="api-message"></div>
                </form>
            </div>
        </div>
    </body>
</html>

```
</details>

### **page-index.js**
Le JavaScript de l'index est très léger : On y voit seulement la fonction, du professeur, qui assigne la fonction qui permet de se connecter au serveur via une form HTML déjà implemanté.
<details>
<summary>JavaScript</summary>

```JavaScript
import {signin} from './sirius-api';

window.addEventListener("load", () => {
    document.querySelector("form").onsubmit = function () {
        return signin(this);
    }
});

```

</details>

---
<br>

## **Lobby**
Le lobby est un écran de connection aux différents serveurs de jeu. Celui-ci offrira à l'utilisateur une liste de partie dépendant de son niveau. Cette liste sera affichée par [Lobby.vue](#Lobbyvue) grâce à l'API du serveur Sirius. Additionellement, les autres éléments seront stylisé par du [JavaScript] ainsi que du [HTML] de base.
### **lobby.html**
Le HTML du lobby représente l'architecture de base la vue du lobby de jeu. On y voit dans les grandes lignes :
- Un header comportant le message de bienvenue.
- Un contenant qui contient :
    - Le nom du joueur
    - Le nombre de point qu'il a de disponible.
    - Son niveau
    - La liste des niveaux possible.
    - Un boutton pour se déconnecter.
<details>
<summary>HTML</summary>

```HTML
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Lobby</title>
        <script src="dist/lobby.js"></script>
        <link rel="stylesheet" href="css/global.css">
        <link rel="icon" href="img/favicon.png" type="image/png" />
    </head>
    <body id="lobby">
    <div class = "flex center column">
        <div class="header">
            <div class="container"><h1>Bienvenue, Héro. Faites votre choix ...</h1>
                <p><i>Une histoire vous attends.</i></p></div>
        </div>
        <div class = "flex column container">
            <h1 id="hero" class = "name"></h1>
            <h3 id="hero-points"></h3>
            <div class = "flex center row" id="game-list"></div>
            <div id="join-error"></div>
        </div>
        <a id="signout" class="button container" href="javascript:void(0)">Déconnexion</a>
    </div>
    </body>
</html>
```
</details>

### **page-lobby.js**
Ce fichier Javascript a pour but d'afficher les informations des parties disponibles aux joueurs ainsi que leur informations personnelles de jeu. De plus, ces informations, grâce à un callback de l'API, sera appellé à tous les 4 secondes afin de l'actualiser. De plus la liste des parties sera fait en Vue.

On y importe plusieurs fonction de l'API pour ce faire, tel que : La fonction qui permettra d'enregistrer les callbacks, celle qui permet de se déconnecter ainsi que celle qui démarre la loop pour lister les parties à chaque 4s.
<details><summary>Importations</summary>

```JavaScript
import {gameListLoop, signout, registerLobbyCallbacks} from './sirius-api';
```
</details>
<p></p>

De plus, on y créé aussi un module de Vue pour créer le module Lobby.Vue, sans le monter puisque son div contenant n'existe pas encore.
<details><summary>Création de Lobby.vue</summary>

```JavaScript
import {createApp} from "vue";
import Lobby from "./Lobby.vue";
let root
const app = createApp(Lobby);
```
</details>
<p></p>

Ce n'est, cependant, qu'après le chargement final de la page que les fonction seront appelé. Vue sera monté. Les callbacks seront enregistré. La loop sera débuté. Finalement, le bouton déconnection sera liée avec sa fonction attitrée.
<details><summary>Après chargement</summary>

```JavaScript
window.addEventListener("load", () => {
    root = app.mount("#game-list");
    registerLobbyCallbacks(listUpdate, playerInfo);
    gameListLoop();
    document.querySelector("#signout").onclick = signout;
});
```
</details>
<p></p>

Par la suite, nous avons les fonctions du fichier :
- listUpdate -> Une fonction qui sera appellé automatique à chaque seconde par le Sirius API. Elle permet d'y afficher une multitude d'information quant aux parties, mais ce côté sera couvert dans la partie Lobby.vue. Elle prend en *paramètre* **List**. Soit une liste de toutes les parties triées et accessible au joueur dépendant de son niveau actuel.
- playerInfo -> Une fonction appellé une fois en début de partie qui permettra d'afficher une multitude d'information à propos du joueur, tel que sa classe, son niveau et son nom. Elle prend **data** en *paramètre*

<details><summary>listUpdate</summary>

```JavaScript
/**
 * Liste des parties du jeu. Cette fonction est appelée automatiquement à chaque 4 secondes environ.
 *
 * Chaque partie contient plusieurs informations (ex : level, name, id, etc)
 * @param {*} list de parties
 */
const listUpdate = list => {
    root.refreshGames(list);
    console.log(list);
}
```
</details>

<details><summary>playerInfo</summary>

```JavaScript
/**
 * Fonction automatiquement appelée 1 fois, permettant d'avoir des informations sur votre personnage
 * @param {*} data du joueur (sa classe, son nom, son niveau, etc)
 */
const playerInfo = data => {
    document.querySelector("#hero").innerHTML = data.username;
    document.querySelector("#hero-points").innerHTML = "( "+ data.type + " de niveau "
    + data.level + ", points à dépenser : " + 
    (parseInt(data.unspent_points) + parseInt(data.unspent_skills)) + " )";
}
```
</details>
<p></p>

### **lobby.vue**
Ce module offre la disponibilité d'avoir une affichement hautement dynamique et facilement modifible. Ici, nous y modifions la liste des parties de jeu dependant de la liste reçu d'un callback précédemment enregistré par l'API sirius via le fichier JavaScript. Un fichier vue est séparé en trois éléments principaux : Le template, le script et le style.
  
Le template sert à présenter une base du fichier HTML qui sera créé et y présenter la où le script sera demandé et comment. On peut donc y voir :
- Un bind qui servira comme boucle pour chaque partie.
- Plusieurs divs dans lequels nous irons déposer l'information fetch depuis le serveur, individuelle à chaque partie, tel que :
    - Le nom
    - Le nombre de personne présentement présente contre le nombre de personne total autorisée
    - Le niveau reliée à la partie.
    - Le bouton qui permet de rejoindre cette partie grâce à son id.
<details><summary>Template</summary>

```js
<template>
  <div class = "game" v-bind:key="game" v-for="game in games">
    <div class="name">{{ game.name }} </div>
    <div class="game-players">{{ game.nb }} / {{ game.max_users }} joueurs</div>
    <div class="game-level">Niveau : {{ game.level }}</div>
    <div class="game-join">
      <button @click="joinGame(game.id)" class="button">Rejoindre</button>
    </div>
  </div>
</template>
```
</details>
<p></p>

Additionellement, dans ce fichier vue, il y a un fichier script. Son role est de liée l'information qui est reçu du fichier Javascript au template par le biais de la reception et de l'entreposage de celle ci. Elle ira également déposer la fonction "joinGame" du Sirius API avec l'id reliée a la partie et d'un onclick event.
<details><summary>script</summary>

```js
<script>
import {joinSiriusGame} from "./sirius-api";
export default {
  name: 'Lobby',
  data() {
    return {
      games: [],
    };
  },
  methods: {
    refreshGames(games){this.games = games;},
    joinGame(id){joinSiriusGame(id);},
    changeIcon(type){return `img/${type}.jpg`;}, // TODO: make it work inside the template
  },
};
</script>
```
</details>

---
## **Game**
Game est la collection des fichier objects du jeu ainsi que de son fichier JavaScript et de son fichier HTML.

En bref, le jeu possède une interface similaire aux premiers RPG web, tel que Adventure Quest. Une hommage à un style de jeu qui berça mon enfance.

En bref, on y verra :
- game.html
- page-game.js
- character
- Les personnages (Plus ou moins similaire pour chacun)
- TiledImage.js (Fichier volé au prof :))

### **game.html**
Ce fichier HTML importera game.js comme fichier JavaScript de base. De plus, il détient les contenants principaux du jeu, tel; que :
- Le contenant principal "game" du jeu.
    - Le contenant de tout les personnages "characters".
    - Le contenant des bars de vies et de mana de tout les personnages.
    - Le contenant des attaques.
        - Les trois bouton reliées aux attaques.
    - Un contenant pour les messages des joueurs.

### **page-game.js**
Page-Game.js représente en quelque sorte le controlleur du jeu qui s'occupera de mettre tout les éléments en relations ainsi que de modifier leur valeurs afin d'y présenter la vue mise à jour. Le back-end est complètement dirigée par l'API de Sirius et seulement le front-end et la gestion des sprites est diponible dans ce fichier.
  
On y retrouve l'importation des fonction de l'API, tel que l'enregistrement des callbacks de jeu et le la demande de Game Loop.

On y importe aussi les fichiers d'objet Wizard, Warrior et Healer. Malheureusement, Range n'a jamais été complété.

<details><summary>Importations de game.</summary>

```js
import {registerGameCallbacks,  gameLoop} from './sirius-api';
import Wizard from "./Objects/Wizard";
import Warrior from "./Objects/Warrior";
import Healer from "./Objects/Healer";
import Executioner from "./Objects/Executioner";
```
</details>
<p></p>

Le fichier posséde également des variables globales, tel que : la liste des Sprites joueur, le Sprite du boss, la liste des joueurs présentement connectés ainsi que le nom de la map (dans l'optique de pouvoir la modifié entre les parties)
 <details><summary>Variables globales</summary>

```js
/** SpriteList of all the players */
let spriteList = [];
/** SpriteList of the boss */
let bossSprite = null;

/** List of all others connected players with their name*/
let connectedPlayers = [];

/** Contains the name of the current map */
let map = "Eversong";
```
</details>
<p></p>

Par la suite, seulement et seulement après le chargement de la partie, les callback seront lancé ainsi que l'initalisation de la map, du boss et du joueur principal et du tick.
 <details><summary>Après le chargement de game</summary>

```javascript
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
```
</details>
<p></p>

Additionellement, on y verra les fonctions suivantes :
- **changeBackground** -> Une fonction qui permet de changer le background, dans l'optique d'en avoir une différente par type de boss.

- **spawnMainPlayer** -> Une fonction qui fait spawn le personnage principal
- **spawnBoss** -> Une fonction qui fait spawn le boss
- **spawnOtherPlayer** -> Une fonction qui permet de faire spawn un autre joueur en prenant **player** comme paramètre elle affiche également son Sprite, dépendant de sa classe et son message de bienvenue s'il en a un.
- **filterPlayerAction** -> Filtre l'action du joueur dépendant de son type d'attaque entre normal, special1 et special2 en prenant en paramètre l'**id** du joueur qui attaque ainsi que son **type d'attaque**
- **disconnectPlayer** -> Déconnecte un joueur et le retire de la spriteList si jamais il n'est plus présent dans la partie. Cette fonction doit prendre en paramètre **Player**
- **initalizeLocation** -> Initialise la location d'un sprite et le fait marcher jusqu'à sa position d'origine dans son fichier d'objet dépendant de son ID. Elle prend en paramètre **sprite**
- **tick** -> Représente le tick de base du jeu:
    - Il s'agit d'un forEach qui fait tick tout les sprites et les supprime lorsqu'ils ne sont plus tickable.
        - Elle ira donc retirer le sprite ainsi que sa barre de mana et de vie et la retira du SpriteList.
    - Elle fera par la suite ticker le boss.
    - Finira par un requestAnimationFrame sur tick.
- **attackCallback** -> Lorsque l'utilisateur attaque, le serveur renvoit cette fonction. Elle sert donc à afficher l'animation reliées à ce numéro d'attaque. Prend en paramètre **skill**
- **gameUpdate** -> Fonction appellée à chaque 2 secondes environ, et ce, automatique par l'API.
    - Elle débute par mapper la liste des joueurs et s'assure qu'ils sont tous encore connecté. Sinon, il déconecte le joueur non connecté.
    - Pour tout les joueurs connectés :
        - En utilisant la même map, on s'assurera que tout les joueurs connecté sont présent dans le jeu. Sinon, on les connecte et affiche leur sprite.
        - On s'assure qu'ils n'ont pas attaqué, sinon, on fait l'attaque grâce a filter player action.
    - On update la bar de vie et de mana du joueur principal.
    - On update la bar du boss.
    - On update la bar des autres personnages joueurs.
    - On s'assure que le boss n'ai pas attaqué, sinon, on l'affiche.
- **gameOverCallback** -> Fonction appelée automatique par l'API lors de la fin de la partie, gagnante ou non. Cette fonction crééra un div de gameOver et appellera win ou lost dépendant de son état. Par la suite, elle appellera gameOver
    - **win** -> Affiche un message de victoire sur fond vert
    - **lost** -> Affiche un message de perte sur fond rouge
    - **gameOver** -> Ajoute un bouton et lien html vers le lobby pour choisir une autre partie.

 <details><summary>page-game.js</summary>

```javascript
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

```
</details>
<p></p>

### Character.js
Ce fichier représente la classe mère de tout les fichier de personnage. On y voit la création des fonction et des attributs unique aux objets de personnages du jeu. On y créé les éléments HTML et on les incluant dans le fichier. 

Elle prend en paramètres les variables suivantes, qui seront ensuite instanciée localement avec une modification ou non :
- Name -> Le nom de classe du personnage.
- settingDictionnary -> Le dictionnaire des settings d'animation du personnage.
- Le scale du personnage (1 par défaut)
- displayName -> Le nom de joueur du personnage. (Inexistant pour boss)
- refreshRate -> 90 par défaut.

On y instaure en variable local d'objet :
- Position
- Node du personnage
    - Son ZIndex
    - Son ID.
- La node du contenant des barres de vies et de mana
    - Ses classes
    - Son zIndex.
    - Son ID.
    - Une barre de vie
    - Une barre de mana (qui sera retirée plus tard pour le boss)
    - L'affichage de son nom
- Son nom
- Son scale.
- Ses animations, créé à partir du dictionnaire du personnage.
- Son state (toujours idle au début)
- Son refresh rate
- S'il est en vie ou non (toujours oui au début)

On y voit aussi les méthodes suivantes :
- **tick** -> La fonction tick du personnage qui fera passer à la prochaine frame de son animation

- **changeState** -> Une fonction setter qui permet de changer le state du personnage. Prend en paramètre le **State** pour lequel changer l'état actuel. En string.

- **setPosition** -> Positionne, maintenant, le personnage à une position x,y sans animation. Prend en paramètre **X** et **Y**, deux nombres.

- **(async) move** -> Change l'état pour "run" et s'assure que l'animation est du bon côté. Par la suite, grâce à une boucle et un setTimeout relié à un Système de promesse, fait déplacer lentement le personnage vers sa position **to** à partir de **from**. Une fois arrivée, redevient idle. Prend en paramètre deux position sur les X : **to** et **from**. Ne se déplace pas en Y.

- **(async) moveToAndAttack** -> Appelle la fonction move, par la suite (then), exécute l'attaque, par la suite (then), retourn à la position de départ. Prend en paramètre **from**, **to**, et **attackid**. attackID étant le nom de l'attaque. 

- **(async) moveBack** -> Fonction utilisé pour effectuer un mouvement de retour. Tourne l'animation de côté et fait un mouvement avec promesse, identique à move, mais avec une boucle for négative. Prend en paramètre **from** et **to**, deux positions sur les X.

- **(async) simpleAttack** -> Fonction utilisé pour afficher une attaque d'un joueur dépendant du type d'attaque et des animation disponibles. Prend en paramètre l'**attackId**
    - Change le state pour celui de l'attackID.
    - Calcule le temps nécessaire a l'attaque.
    - Permet, grâce à un set timeout et une promesse, à l'animation de faire toute son animation avant de se terminer.
    - Retourne le state à idle.

- **updateBars** -> Met à jour les valeurs (current/max) de vie et de mana dans la mana bar et la healthbar. Prend en paramètre **health** et **mana** qui contiennent toute deux la valeur courante et maximale de leur types respectifs.

- **distanceBetweenX** -> Utilisé uniquement lors des fonctions d'attaques des personnages. Elle permet de calculer, pour les attaques corps à corps, la distance entre l'ennemi et le joueur avec la marge vide su Sprite du boss. Prend en paramètre l'**objet du boss**

 <details><summary>Character.js</summary>

```javascript
import TiledImage from "./TiledImage.js";

/**
 * @class Character
 * @description Classe de base pour tout les personnages du jeu.
 * @param {string} name - Le nom du personnage.
 * @param {string} type - Le type du personnage.
 * @param {object} settingDictionary - Contient les settings de l'animation.
 * @param {object} node - Le noeud HTML du personnage.
 * @param {number} scale - L'échelle du personnage.
 * @param {number} refreshRate - Le taux de rafraichissement de l'animation.
 *
 * @see TiledImage
 */
export default class Character {
    constructor(name,
                settingDictionary,
                scale = 1,
                position,
                displayName,
                refreshRate = 90 ) {
        this.position = position;
        // Creation du noeud html des barres de vie et de mana.
        this.node = document.createElement("div");
        this.node.id = name;
        this.node.style.zIndex = 2;
        document.getElementById("characters").appendChild(this.node);

        // Creation du div des barres du personnage
        let barNode = document.createElement("div");
        barNode.id = name + "_bar";
        barNode.classList.add("flex");
        barNode.classList.add("column");
        barNode.classList.add("bar-container");
        barNode.style.zIndex = 2;

        // Creation de la barre de vie
        this.name = document.createElement("div");

        this.name.classList.add("name");
        if (displayName) {
            this.name.innerHTML = displayName;
        } else {
            this.name.innerHTML = name;
        }
        barNode.appendChild(this.name);
        this.healthBar = document.createElement("progress");
        this.healthBar.id = name + "_health";
        this.healthBar.classList.add("health");
        this.healthBar.classList.add("bar");
        barNode.appendChild(this.healthBar);

        // Creation de la barre de mana
        this.manaBar = document.createElement("progress");
        this.manaBar.id = name + "_mana";
        this.manaBar.classList.add("mana");
        this.manaBar.classList.add("bar");
        barNode.appendChild(this.manaBar);

        // Append le div des barres au noeud des barres du personnage
        document.getElementById("bars").appendChild(barNode);
        this.barNode = barNode;

        this.name = name;
        this.refreshRate = refreshRate;
        this.scale = scale;
        this.animations = {};
        this.state = "idle";
        this.isAlive = true;

       // Create a new TiledImage for each animation
        for (let key in settingDictionary) {
            if (settingDictionary[key].attackType !== undefined) {
                this.animations[key] = settingDictionary[key].attackType;
            }
            this.animations[key] =
                new TiledImage(settingDictionary[key].image,
                    settingDictionary[key].column,
                    settingDictionary[key].row,
                this.refreshRate,
                true,
                this.scale,
                this.node);
        }
    }
    /**
     * @Starts the animation tick of the current state.
     * @return {boolean} - Returns true if the animation tick was started.
     */
    tick() {
        if(this.isAlive) {
            this.animations[this.state].tick();
            return true;
        } return false;
    }

    /**
     * @Changes the state of the character.
     * @param state
     */
    changeState(state) {
        this.state = state;
    }

    setPosition(x, y) {
        this.node.style.left = x+ "vw";
        this.node.style.top = y + "vh";
    }

    async move(from, to) {
        this.changeState("run");
        this.animations["run"].setFlipped(false);

        for (let i = from; i < to; i++) {
            this.setPosition(i, this.position.y);
            await new Promise(r => setTimeout(r, 15));
        }
        this.changeState("idle");
    }

    async moveToAndAttack(from, to, attackId) {
        this.move(from, to).then(() => {
            this.simpleAttack(attackId).then(() => {
                this.moveBack(from, to);
            });
        });
    }

    async moveBack(from, to) {
        this.changeState("run");
        this.animations["run"].setFlipped(true);
        for (let i = to; i > from; i--) {
            this.setPosition(i, this.position.y);
            await new Promise(r => setTimeout(r, 15));
        }
        this.changeState("idle");
    }

    async simpleAttack(attackid) {
        this.changeState(attackid);
        /* Wait until attack1 frame has stopped */
        let time = this.animations[attackid].tickRefreshInterval
            * this.animations[attackid].imageTileColCount;
        await new Promise(r => setTimeout(r, time));
        this.changeState("idle");
    }

    updatebars = (health, mana) => {

        this.healthBar.value = health[0];
        this.healthBar.max = health[1];

        this.manaBar.value = mana[0];
        this.manaBar.max = mana[1];
    }

    distanceBetweenX(character) {
        let x1 = character.position.x;
        let x2 = this.position.x;
        return Math.abs(x1 - x2) + character.personalMargin;
    }

```
</details>
<p></p>

---
## **Les personnages.**
### ***Healer.js, Warrior.js, Wizard.js, Executioner.js***
L'exemple qui suit prendra comme objet "healer", car ils sont plus ou moins tous identique, à l'exception de la valeur de certains attributs.

Les objets de personnages sont toutes des sous-classes de Character.js. Elle en hérite ses attributs et ses méthodes.
#### **Attributs**
- Créé la position, unique à chaque classe, qui contient :
    - Un valeur x, reliée à la classe.
    - Une valeur y, reliée à un calcul basée sur la classe et l'index du joueur.

- Créé un dictionnaire des settings de l'animation. Elle sera par la suite envoyé dans le constructeur de Character pour devenir les animations. Contient :
    - Le lien vers l'image dans le système.
    - Le nombre de colonne dans l'image.
    - Le nombre de ligne dans l'image.


Elle envoira en paramètre au contructeur de Character.js :
- Le nom, le setting dictionary, le scale (créé sur place), et la position

#### **Méthodes**
Il y a 3 méthodes dans chaque fichier de personnage : Les actions 1, 2 et 3. Il s'agit de fonctions **asynchrone** qui filtrent les attaques en jeu.
- Elles prennent en paramètre le personnage qui se fait attaquer.
- Elles appelles moveToAndAttack, en lui envoyant :
    - Sa position
    - L'addition de :
        - La distance entre lui et le boss.
        - Sa position 
        - La marge personnel du boss (unique au boss, permet de prendre en considération l'espace vide de la spritesheet.)

## **TiledImage**
Ce fichier appartient au professeur. Il est responsable de la création de la gestion des spritesheet, à l'extérieur de la gestion de l'état et quelques autres détails. Characters agit comme une sorte de filtre pour prendre et modifier TiledImage pour mieux convenir à mes besoins (Du aux spritesheet différentes et besoins différents que l'utilisation habituelle de TiledImage).

 <details><summary>Healer.js</summary>

```javascript
import Character from "./Template/Character";

export default class Healer extends Character {
    constructor(name = "heal", index) {
        let ingamePosition = {x: 25, y: 25};
        if (index >= 1) {
            ingamePosition.y = ingamePosition.y + (index * 7);
        }

        let path = "../../sprite/healer/"
        // Dictionnaire contenant les settings de l'animation.
        let animationsSettingDictionary = {
            "death": {
                "image": path + "death.png",
                "column": 11,
                "row": 1,
            },
            "idle": {
                "image": path + "idle.png",
                "column": 6,
                "row": 1,
            },
            "run": {
                "image": path + "run.png",
                "column": 8,
                "row": 1,
            },
            "attack1": {
                "image": path + "Attack1.png",
                "column": 12,
                "row": 1,
            },
            "attack2": {
                "image": path + "Attack2.png",
                "column": 10,
                "row": 1,
            },
            "attack3": {
                "image": path + "Attack3.png",
                "column": 9,
                "row": 1,
            },
            "hit:": {
                "image": path + "hit.png",
                "column": 4,
            }
        }
        super(name, animationsSettingDictionary, 0.5, ingamePosition);
    }

    distanceBetweenX(boss) {
        let x1 = boss.position.x;
        let x2 = this.position.x;
        return Math.abs(x1 - x2)
    }

    async action1(boss) {
        await this.moveToAndAttack(this.position.x,
            this.distanceBetweenX(boss) + this.position.x
            + boss.personalMargin,
            "attack2");
    }

    async action2(boss) {
        await this.moveToAndAttack(this.position.x,
            this.distanceBetweenX(boss) + this.position.x
            + boss.personalMargin,
            "attack1");
    }

    async action3(boss) {
        await this.action1(boss);
    }
}
```
</details>