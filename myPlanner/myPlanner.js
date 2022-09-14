import fs from "fs"
import crypto from "node:crypto";
import jsonwebtoken from "jsonwebtoken";

const DATA_JSON = "./myPlanner/data.json";
const DATA_DEFAULT_JSON = "./myPlanner/dataTDefault.json";

export function init () {
    if (!fs.existsSync(DATA_JSON)) {
        let data = JSON.parse(fs.readFileSync(DATA_DEFAULT_JSON));
        fs.writeFileSync(DATA_JSON, JSON.stringify(data))
    }
}

export function checkToken (token) {

}

export function register (name, uname, pass) {

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
