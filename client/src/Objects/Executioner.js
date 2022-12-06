import Character from "./Template/Character";

export default class executioner extends Character{
    constructor(name = "boss") {
        let ingamePosition = {x: "50", y: "-10"};

        let path = "../../sprite/executioner/"
        // Dictionnaire contenant les settings de l'animation.
        let animationsSettingDictionary = {
            "death": {
                "image": path + "death.png",
                "column": 10,
                "row": 2,
            },
            "idle": {
                "image": path + "idle2.png",
                "column": 4,
                "row": 2,
            },
            "attack": {
                "image": path + "attacking.png",
                "column": 6,
                "row": 2,
                "attackType": "melee"
            },
            "summon": {
                "image": path + "summonAppear.png",
                "column": 3,
                "row": 2,
            },
        };
        super(name, animationsSettingDictionary, 8, ingamePosition,
            "L'Éxecutionneur"); // 90 et 1 sont les valeurs par défaut

        for (let animation in this.animations) {
            this.animations[animation].setFlipped(true);
        }

        // Make it behind the players and the divs

        this.setPosition(this.position.x, this.position.y);

        /* Delete manabar */
        this.manaBar.remove();
        this.personalMargin = 8;
        this.node.style.zIndex = 1;
    }


    async action1() {
        await this.simpleAttack("attack1");
    }

    updatebars = (health) => {
        this.healthBar.value = health[0];
        this.healthBar.max = health[1];
    }

}