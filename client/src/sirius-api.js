let listCallback = null;
let attackCallback = null;
let gameCallback = null;
let gameOverCallback = null;
let atkNode1 = null;
let atkNode2 = null;
let atkNode3 = null;
let gameInitialised = false;
let gamePlayer = null;
let lastAction = null;

const BASE_API_URL = "https://apps-de-cours.com/web-sirius/server/api";

const findGetParameter = parameterName => {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

let k = findGetParameter("k");

if (k != null) {
    localStorage["sirius_key"] = k;
    localStorage["username"] = findGetParameter("u");
    window.location.href = "lobby.html";
}

export const signin = formNode => {
    localStorage["username"] = formNode.username.value;

    let formData = new FormData();
    formData.append('username', formNode.username.value);
    formData.append('pwd', formNode.password.value);

    fetch(BASE_API_URL + "/signin", {
        method: "POST",
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.length == 40) {
            localStorage["sirius_key"] = data;
            window.location.href = "lobby.html?k=" + localStorage["sirius_key"] + "&u=" + localStorage["username"];
        }
        else {
            document.querySelector("#api-message").innerText = data;
        }
    });

    return false;
}

export const signout = () => {
    let formData = new FormData();
    formData.append('key', localStorage["sirius_key"]);

    fetch(BASE_API_URL + "/signout", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        localStorage.removeItem("sirius_key");
        window.location.href = "index.html";
    });

    return false;
}

export const gameListLoop = () => {
    let formData = new FormData();
    formData.append('key', localStorage["sirius_key"]);

    setTimeout(() => {
        fetch(BASE_API_URL + "/list", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data instanceof Array) {
                listCallback(data);
                setTimeout(gameListLoop, 4000);
            }
            else {
                localStorage.removeItem("key");
                window.location.href = "index.html";
            }
        });
    },  2000);
}

export const joinSiriusGame = (id, errorCallback) => {
    let formData = new FormData();
    formData.append('key', localStorage["sirius_key"]);
    formData.append('id', id);

    fetch(BASE_API_URL + "/enter", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data == "GAME_ENTERED") {
            window.location.href="game.html";
        }
        else {
            errorCallback();
        }
    });
}

export const gameLoop = () => {
    let formData = new FormData();
    formData.append('key', localStorage["sirius_key"]);

    setTimeout(() => {
        fetch(BASE_API_URL + "/state", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (typeof data !== "object") {
                gameOverCallback(data);
            }
            else {
                gamePlayer = data.player;

                data.player.skills.forEach(s => {
                    let n = null;
                    if (s.name == "Normal") n = atkNode1;
                    else if (s.name == "Special1") n = atkNode2;
                    else if (s.name == "Special2") n = atkNode3;

                    if (!gameInitialised) {
                        n.style.opacity = 1;
                        n.setAttribute("data-max-opacity", 1);

                        n.onclick = () => {
                            attack(s);
                        }
                    }
                    else if (gamePlayer.mp < s.cost) {
                        n.style.opacity = 0.5;
                        n.setAttribute("data-max-opacity", 0.5);
                        n.onclick = () => {};
                    }
                })

                gameInitialised = true;
                gameCallback(data.game, data.player, data.other_players);
                setTimeout(gameLoop, 2000);
            }
        });
    },  2000);
}

const changeBtnsOpacity = opacity => {
    atkNode1.style.opacity = atkNode1.getAttribute("data-max-opacity") < opacity ? atkNode1.getAttribute("data-max-opacity") : opacity;
    atkNode2.style.opacity = atkNode2.getAttribute("data-max-opacity") < opacity ? atkNode2.getAttribute("data-max-opacity") : opacity;
    atkNode3.style.opacity = atkNode3.getAttribute("data-max-opacity") < opacity ? atkNode3.getAttribute("data-max-opacity") : opacity;
}

export const attack = (skill) => {
    if (gamePlayer.hp > 0 && skill.cost <= gamePlayer.mp &&
        (lastAction == null || lastAction + 2000 < new Date().getTime())) {
        lastAction = new Date().getTime() + 10000;

        changeBtnsOpacity(0.5);
        attackCallback(skill);

        let formData = new FormData();
        formData.append('key', localStorage["sirius_key"]);
        formData.append('skill-name', skill.name);

        fetch(BASE_API_URL + "/action", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            lastAction = new Date().getTime();

            setTimeout(() => {
                changeBtnsOpacity(1);
            }, 2000);
        });
    }
}

export const registerLobbyCallbacks = (listCb, heroInfoCb) => {
    listCallback = listCb;

    setTimeout(() => {
        let formData = new FormData();
        formData.append('key', localStorage["sirius_key"]);

        fetch(BASE_API_URL + "/user-info", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            heroInfoCb(data);
        });
    }, 2000);
}

export const registerGameCallbacks = (gameCb, gameOverCb, attackCb, attackNode1, attackNode2, attackNode3) => {
    attackCallback = attackCb;
    gameCallback = gameCb;
    gameOverCallback = gameOverCb;
    atkNode1 = attackNode1;
    atkNode2 = attackNode2;
    atkNode3 = attackNode3;

    atkNode1.setAttribute("data-max-opacity", 0.5);
    atkNode2.setAttribute("data-max-opacity", 0.5);
    atkNode3.setAttribute("data-max-opacity", 0.5);
    changeBtnsOpacity(0.5);
}