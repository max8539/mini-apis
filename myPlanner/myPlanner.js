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
    
}

function saveData (data) {
    
}

function passwordHash (password) {
    
}

export function init () {
    
}

export function checkToken (token) {
    
}

export function register (uname, email, pass) {
    
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
