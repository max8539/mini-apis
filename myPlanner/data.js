// mini-apis: myPlanner/data.js
// https://github.com/max8539/mini-apis
// 
// This file contains a class which manages all the data used by 
// the myPlanner API. 
// 
// Currently the data is stored as a single object with many sub-arrays 
// and sub-objects, loaded and saved to a single .json file, and handled
// manually using JavaScript. 
// Data storage may be moved to a proper database
// in the future, with this class becoming an interface for the database. 
// IMPORTANT: User input should be validated and/or sanitised before 
// calling methods which save that data.
// 
// Copyright (C) 2022 Max Yuen
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import fs from "fs";

const DATA_JSON = "./myPlanner/data.json";
const DATA_DEFAULT_JSON = "./myPlanner/dataTDefault.json";

export class DataRefError extends Error{};
export class UnameExistsError extends Error{};

export class Data {
    #data;
    constructor () {
        if (fs.existsSync(DATA_JSON)) {
            this.#data = JSON.parse(fs.readFileSync(DATA_JSON));
        } else {
            this.#data = JSON.parse(fs.readFileSync(DATA_DEFAULT_JSON));
        }
    }

    #updateSave () {
        fs.writeFileSync(DATA_JSON, JSON.stringify(this.#data));
    }

    /**
     * Avoid in actual methods, but useful as a debug output,
     * may be removed if data storage switches to a database.
     * @return {object} The root data object, 
     * containg all sub-arrays and sub-obmects
    */
    dataGetAll () {
        return this.#data;
    }

    #userNewId () {
        let newId;
        let valid = false;
        while (!valid) {
            valid = true;
            newId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            for (userObj of this.#data.users) {
                if (userObj.uid = newId) {
                    valid = false;
                }
            }
        }
        return newId;
    }
    #userCheckExists (uid) {
        for (userObj of this.#data.users) {
            if (userObj.uid == uid) {
                return;
            }
        }
        throw new DataRefError();
    }
    #unameCheckExists (uname) {
        for (userObj of this.#data.users) {
            if (userObj.uname == uname) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * Returns an array of usernames of all registered users.
     * @returns {Array.<string>} Array of usernames of all users
     */
    usersGetSummaryArr () {
        let arr = [];
        for (userObj of this.#data.users) {
            arr.push({
                uid: userObj.uid,
                uname: userObj.uname
            });
        }
        return arr;
    }
    /**
     * Returns all user information for a user.
     * @param {number} uid User's ID
     * @returns {object} Object containing all information stored about a user,
     * or null if the user does not exist.
     */
    userGetById (uid) {
        let result = null;
        for (userObj of this.#data.users) {
            if (uid == userObj.uid) {
                result = userObj;
            }
        }
        if (result == null) {throw new DataRefError()}
        return result;
    }
    
    /**
     * Adds a new user with the given data, or throw a `UnameExistsError` if 
     * the given username has already been used.
     * @param {object} userData Object containing the following fields:
     * `name`, `uname`, `hashedPass`
     * @return {number} New user's ID.
     */
    userAddNew (userData) {
        if (this.#unameCheckExists(userData.uname)) {throw new UnameExistsError()}
        let newUid = this.#userNewId();
        this.#data.users.push({
            uid: newUid,
            name: userData.name,
            uname: userData.uname,
            hashedPass: userData.hashedPass
        })
        return newUid;
    }
    /**
     * Updates the user's username, or throws a `UnameExistsError` if 
     * the given username has already been used.
     * @param {number} uid User's ID
     * @param {string} newUname User's new username
     */
    userEditUname (uid, newUname) {
        let userObj = this.userGetById(uid);
        if (this.#unameCheckExists(newUname)) {throw new UnameExistsError()}
        userObj.uname = newUname;
        this.#updateSave();
    }
    /**
     * Updates the user's name and password.
     * @param {number} uid User's ID
     * @param {object} userData Object containing the following fields:
     * `name`, `hashedPass`
     */
    userEditOther (uid, userData) {
        let userObj = this.userGetById(uid);
        userObj.name = userData.name;
        userObj.hashedPass = userData.hashedPass;
        this.#updateSave();
    }
    /**
     * Deletes a user, all their owned events and tasks, and
     * removes them from any shared events.
     * @param {number} uid User ID
     */ 
    userDelete (uid) {
        this.#userCheckExists(uid);
        for (eventObj of this.#data.events) {
            eventObj.sharedUsers.filter(sharedUid => uid != sharedUid);
        }
        this.#data.events.filter(eventObj => eventObj.owner != uid);
        this.#data.tasks.filter(taskObj => taskObj.owner != uid);
    }

    #eventNewId () {
        let newId;
        let valid = false;
        while (!valid) {
            valid = true;
            newId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            for (eventObj of this.#data.events) {
                if (eventObj.eid = newId) {
                    valid = false;
                }
            }
        }
        return newId;
    }
    #eventCheckExists (eid) {
        for (eventObj of this.#data.events) {
            if (eventObj.eid == eid) {
                return;
            }
        }
        throw new DataRefError();
    }
    #eventSort () {
        this.#data.events.sort((a, b) => {b.time - a.time});
    }
    /**
     * Takes an event ID and retrieves all stored information about that event.
     * @param {number} eid Event ID
     * @returns {object} Object containing all data stored about an event
     */
    eventGetById (eid) {
        let result = null;
        for (eventObj of this.#data.events) {
            if (eventObj.eid == eid) {
                result = eventObj;
            }
        }
        if (result == null) {throw new DataRefError()}
        return result;
    }
    /**
     * Returns an array of event symmaries which the user is the owner of.
     * @param {number} uid User's ID
     * @returns {Array.<object>} Array of events
     */
    userGetEventsSummaryArr (uid) {
        this.#userCheckExists(uid);
        let arr = [];
        for (eventObj of this.#data.events) {
            if (eventObj.owner == uid) {
                arr.push({
                    eid: eventObj.eid,
                    title: eventObj.title,
                    time: eventObj.time,
                });
            }
        }
        return arr;
    }
    /**
     * Returns an array of event summaries which the user was shared into.
     * @param {number} uid User's ID
     * @returns {Array.<number>} Array of events
     */
    userGetSharedEventsSummaryArr (uid) {
        this.#userCheckExists(uid);
        let arr = [];
        for (eventObj of this.#data.events) {
            if (uid in eventObj.sharedUsers) {
                arr.push({
                    eid: eventObj.eid,
                    title: eventObj.title,
                    time: eventObj.time,
                });
            }
        }
        return arr;
    }
    /**
     * **IMPORTANT: Validate and/or sanitise user input before 
     * calling this method.**
     * 
     * Adds a new event owned by the specified user.
     * @param {number} uid User's ID
     * @param {object} eventData Object containing the following fields:
     * `title`, `time`, `description`, `public`
     */
    eventAddNew (uid, eventData) {
        this.#userCheckExists(uid);
        let newEvent = {
            eid: this.#eventNewId(),
            title: eventData.title,
            time: eventData.time,
            description: eventData.description,
            owner: uid,
            public: eventData.public,
            sharedUsers: []
        }
        this.#data.events.push(newEvent);
        this.#eventSort();
        this.#updateSave();
    }
    /**
     * **IMPORTANT: Validate and/or sanitise user input before 
     * calling this method.**
     * 
     * Updates the title, time, description and public fields of an event
     * with the given event data.
     * @param {number} eid Event ID 
     * @param {object} eventData Object containing the following fields:
     * `title`, `time`, `description`, `public`
     */
    eventEdit (eid, eventData) {
        let eventObj = this.eventGetById(eid);
        eventObj.title = eventData.title;
        eventObj.time = eventData.time;
        eventObj.description = eventData.description;
        eventObj.public = eventData.public;
        this.#eventSort();
        this.#updateSave();
    }
    /**
     * Add a user to an event's shared users list.
     * @param {number} eid Event ID
     * @param {number} uid User's ID to be added to the event's shared users
     */
    eventAddSharedUser (eid, uid) {
        this.#userCheckExists(uid);
        let eventObj = this.eventGetById(eid);
        eventObj.sharedUsers.push(uid);
        this.#updateSave();
    }
    /**
     * Deletes an event.
     * @param {number} eid Event ID
     */
    eventDeleteById (eid) {
        this.#eventCheckExists(eid)
        this.#data.events = this.#data.events.filter(eventObj => eventObj.eid != eid);
        this.#updateSave();
    }
    
    #taskNewId () {
        let newId;
        let valid = false;
        while (!valid) {
            valid = true;
            newId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
            for (taskObj of this.#data.tasks) {
                if (taskObj.tid = newId) {
                    valid = false;
                }
            }
        }
        return newId;
    }
    #taskCheckExists (tid) {
        for (taskObj of this.#data.tasks) {
            if (taskObj.tid == tid) {
                return;
            }
        }
        throw new DataRefError();
    }
    #taskSort () {
        this.#data.tasks.sort((a, b) => {b.time - a.time});
    }
    /**
     * Takes a task ID and retrieves all stored information about that task.
     * @param {number} tid Task ID
     * @returns {object} Object containing all data stored about a task
     */
    taskGetById (tid) {
        let result = null;
        for (taskObj of this.#data.tasks) {
            if (taskObj.tid == tid) {
                result = taskObj;
            }
        }
        if (result == null) {throw new DataRefError()}
        return result;
    }
    /**
     * Returns an array of task summaries which the user is the owner of.
     * @param {number} uid User's ID
     * @returns {Array.<object>} Array of tasks
     */
    userGetTasksSummaryArr (uid) {
        this.#userCheckExists(uid);
        let arr = [];
        for (taskObj of this.#data.tasks) {
            if (taskObj.owner == uid) {
                arr.push({
                    tid: taskObj.tid,
                    title: taskObj.title,
                    time: taskObj.time,
                    done: taskObj.done
                });
            }
        }
        return arr;
    }
    /**
     * Returns an array of the user's unfinished tasks.
     * @param {number} uid User's ID
     * @returns {Array.<object>} Array of tasks
     */
    userGetUnfinishedTasksArr (uid) {
        let arr = this.userGetTasksArr(uid);
        return arr.filter(task => !task.done);
    }
    /**
     * Returns an array of the user's finished tasks.
     * @param {number} uid User's ID
     * @returns {Array.<object>} Array of tasks
     */
    userGetFinishedTasksArr (uid) {
        let arr = this.userGetTasksArr(uid);
        return arr.filter(task => task.done);
    }
    /**
     * **IMPORTANT: Validate and/or sanitise user input before 
     * calling this method.**
     * 
     * Adds a new task owned by the specified user.
     * @param {number} uid Owner's user ID
     * @param {object} taskData Object containing the following fields:
     * `title`, `time`, `description`
     * @return {number} New task's ID
     */
    taskAddNew (uid, taskData) {
        this.#userCheckExists();
        let newTid = this.#taskNewId();
        let newTask = {
            tid: newTid,
            title: taskData.title,
            time: taskData.time,
            description: taskData.description,
            owner: uid,
            done: false
        }
        this.#data.tasks.push(newTask);
        this.#taskSort();
        this.#updateSave();
        return newTid;
    }
    /**
     * **IMPORTANT: Validate and/or sanitise user input before 
     * calling this method.**
     * 
     * Updates the title, time, and description fields of a task
     * with the given task data.
     * @param {number} tid Task ID 
     * @param {object} taskData Object containing the following fields:
     * `title`, `time`, `description`
     */
    taskEdit (tid, taskData) {
        let taskObj = this.taskGetById(tid);
        taskObj.title = taskData.title;
        taskObj.time = taskData.time;
        taskObj.description = taskData.description;
        this.#taskSort();
        this.#updateSave();
    }
    /**
     * Updates whether a task is done or not done.
     * @param {number} tid Task ID
     * @param {boolean} done New "done" value of task
     */
    taskToggleDone (tid, done) {
        let taskObj = this.taskGetById(tid);
        taskObj.done = done;
        this.#updateSave();
    }
    /**
     * Deletes a task.
     * @param {number} tid Task ID
     */
    taskDeleteById (tid) {
        this.#taskCheckExists(tid);
        this.#data.tasks = this.#data.task.filter(taskObj => taskObj.tid != tid);
        this.#updateSave();
    }
}
