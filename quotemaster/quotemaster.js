// mini-apis: quotemaster/quotemaster.js
// https://github.com/max8539/mini-apis
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
import crypto from "crypto";

const QUOTES_JSON = "./quotemaster/quotes.json";
const QUOTES_DEFAULT_JSON = "./quotemaster/quotes-default.json";

const HASHEDPASS = "dX2+ujAOKQmKLSaOE7DXKRcz832YgaJupwXe0Q5Sqnw=";

// Custom errors
export class idError extends Error{};
export class quoteError extends Error{};
export class nameError extends Error{};
export class passError extends Error{};

// Initialisation - creates quotes.json if it doesn't exist
// (required for first run after git clone)
export function init () {
    if (!fs.existsSync(QUOTES_JSON)) {
        let data = JSON.parse(fs.readFileSync(QUOTES_DEFAULT_JSON));
        fs.writeFileSync(QUOTES_JSON, JSON.stringify(data))
    }
}

// /quotemaster/random
export function randomQuote () {
    const DATA = JSON.parse(fs.readFileSync(QUOTES_JSON));
    let num = DATA.quotes.length;
    let index = Math.floor(Math.random() * num);
    return DATA.quotes[index];
}

// /quotemaster/popular
export function popularQuote () {
    const DATA = JSON.parse(fs.readFileSync(QUOTES_JSON));
    let popular = DATA.quotes.filter(item => item.likes >= DATA.maxLikes * 0.75);
    let num = popular.length;
    let index = Math.floor(Math.random() * num);
    return popular[index];
}

// /quotemaster/id/:id
export function idQuote (id) {
    const DATA = JSON.parse(fs.readFileSync(QUOTES_JSON));
    if (id < 0 || id >= DATA.quotes.length) {
        throw new idError;
    }
    return DATA.quotes[id];
}

// /quotemaster/like
export function likeQuote (id) {
    const DATA = JSON.parse(fs.readFileSync(QUOTES_JSON));
    if (id >= DATA.quotes.length) {
        throw new idError;
    }
    DATA.quotes[id].likes += 1;
    if (DATA.quotes[id].likes > DATA.maxLikes) {
        DATA.maxLikes += 1;
    }
    fs.writeFileSync(QUOTES_JSON, JSON.stringify(DATA));
}

// /quotemaster/new
export function newQuote (quote, name) {
    if (typeof(quote) != "string") {
        throw new quoteError;
    } else if (quote.length < 1 || quote.length > 400) {
        throw new quoteError;
    } else if (typeof(name) != "string") {
        throw new nameError;
    } else if (name.length < 1 || name.length > 40) {
        throw new nameError;
    }
    const DATA = JSON.parse(fs.readFileSync(QUOTES_JSON));
    let newId = DATA.quotes.length;
    DATA.quotes.push({
        "id": newId,
        "quote": quote,
        "name": name,
        "likes": 0
    });
    fs.writeFileSync(QUOTES_JSON, JSON.stringify(DATA));
    return {id:newId}
}

// /quotemaster/reset
export function resetQuote (pass) {
    const hasher = crypto.createHash("sha256");
    hasher.update(pass);
    let hash = hasher.digest("base64");
    if (hash != HASHEDPASS) {
        throw new passError;
    }
    const DEFAULT = JSON.parse(fs.readFileSync(QUOTES_DEFAULT_JSON));
    fs.writeFileSync(QUOTES_JSON, JSON.stringify(DEFAULT));
}
