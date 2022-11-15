import {signin} from './sirius-api';

import Wizard from "./Objects/Wizard";

let spriteList = [];

window.addEventListener("load", () => {
    document.querySelector("form").onsubmit = function () {
        return signin(this);
    }
    spriteList.push(new Wizard(100, 100));
    tick();
});

const tick = () => {
    spriteList.forEach(sprite => {
        let alive = sprite.tick();
        if (!alive) {
            spriteList.splice(spriteList.indexOf(sprite), 1);
        }
    });
    requestAnimationFrame(tick);
}






