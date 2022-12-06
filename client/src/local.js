/**
 *
 */

const getDataFromLocal = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

const setDataToLocal = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}
