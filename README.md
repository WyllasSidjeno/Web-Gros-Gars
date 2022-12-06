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
    + data.level + ", points à dépenser : " + (parseInt(data.unspent_points) + parseInt(data.unspent_skills)) + " )";
}
```
</details>
<p></p>

Test

