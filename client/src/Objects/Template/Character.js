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

    distanceBetweenX(boss) {
        let x1 = boss.position.x;
        let x2 = this.position.x;
        return Math.abs(x1 - x2) + boss.personalMargin;
    }
}