import TiledImage from "./TiledImage.js";

/**
 * @class Character
 *
 * @param {string} name - The name of the character.
 * @param {string} type - The type of the character.
 * @param {object} animationsSettingDictionary - The dictionary of
 * the settings which will be used to create the animations.
 * @param {object} node - The node of the character.
 * @param {number} refreshRate - The refresh rate of the image
 * @param {number} scale - The scale of the image.
 */
export default class Character {
    constructor(name,
                type,
                animationsSettingDictionary,
                node,
                scale = 2,
                refreshRate = 90
                )
    {
        this.name = name;
        this.type = type;
        this.node = node;
        this.refreshRate = refreshRate;
        this.scale = scale;
        this.animations = {};
        this.state = "idle";

       // Create a new TiledImage for each animation
        for (let key in animationsSettingDictionary) {
            this.animations[key] =
                new TiledImage(animationsSettingDictionary[key].image,
                animationsSettingDictionary[key].column,
                animationsSettingDictionary[key].row,
                this.refreshRate,
                true,
                this.scale,
                node);
        }
    }
    /**
     * @Starts the animation tick of the current state.
     * @return {boolean} - Returns true if the animation tick was started.
     */
    tick() {
        this.animations[this.state].tick();

        return true;
    }

    /**
     * @Changes the state of the character.
     * @param state
     */
    changeState(state) {
        this.state = state;
    }

    /**
     * @Changes the state of the character to "idle".
     * @return {boolean} - Returns true if the state was changed.
     */
    changeStateToIdle() {
        this.changeState("idle");
    }

    /**
     * @Changes the state of the character for a duration.
     * @param state
     * @param duration
     */
    changeStateForDuration(state, duration) {
        this.state = state;
        setTimeout(() => {
            this.changeStateToIdle();
        }, duration);
    }

    /**
     * @Changes the state of the character to run until he has
     * reached the destination.
     * @param x
     */
    moveUntilLocation(x) {
        this.changeState("run");
        let interval = setInterval(() => {
            this.node.style.left = this.node.offsetLeft + 1 + "px";
            if (this.node.offsetLeft >= x) {
                clearInterval(interval);
                this.changeStateToIdle();
            }
        }, 10);
    }
    pauseCurrentAnimation() {
        this.animations[this.state].pause();
    }
}