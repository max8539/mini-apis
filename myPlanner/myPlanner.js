import fs from "fs";
import process from "process";
import crypto from "node:crypto";
import jsonwebtoken from "jsonwebtoken";

const DATA_JSON = "./myPlanner/data.json";
const DATA_DEFAULT_JSON = "./myPlanner/dataTDefault.json";

export class InvalidTokenError extends Error{};

export class UsedUnameError extends Error{};
export class BadPassError extends Error{};

export class InvalidLoginError extends Error{};

function loadData () {
    return JSON.parse(fs.readFileSync(DATA_JSON));
}

function saveData (data) {
    fs.writeFileSync(DATA_JSON, JSON.stringify(data));
}

function passwordHash (password) {
    let hasher = crypto.createHash("hs256");
    hasher.update(password);
    return hasher.digest("base64");
}

export function init () {
    if (!fs.existsSync(DATA_JSON)) {
        let data = JSON.parse(fs.readFileSync(DATA_DEFAULT_JSON));
        fs.writeFileSync(DATA_JSON, JSON.stringify(data))
    }
}

export function checkToken (token) {
    let tokenData;
    try {
        tokenData = jsonwebtoken.verify(token, process.env.TOKEN_KEY,{algorithms:["HS256"]})
    } catch (err) {
        throw new InvalidTokenError;
    }
    let userExists = false;
    let validDate;

    const DATA = loadData();
    for (user of DATA.users) {
        if (user.uname == tokenData.uname) {
            userExists = true;
            validDate = (tokenData.sysLoginTime >= user.earliestLoginTime);
        }
    }

    if (userExists && validDate) {
        return {
            "uname": tokenData.uname,
        }
    } else {
        throw new InvalidTokenError;
    }
    
}

export function register (uname, email, pass) {
    let data = loadData();
    let hashedPass = passwordHash(pass);
    let newUser = {
        uname: uname,
        email: email,
        pass: hashedPass
    }

}

export function login (uname, pass) {

}

export function logoutAll (token) {

}

export function fetch (token) {

}

export function newEvent (token, data) {

}

export function newTask (token, data) {

}

export function editEvent (token, id, data) {

}

export function editTask (token, id, data) {

}

export function completeTask (token, id) {

}

export function deleteEvent (token, id) {

}

export function deleteTask (token, id) {

}
