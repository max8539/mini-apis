// mini-apis: run.js
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


import express from "express";
import cors from "cors";

import * as quotemaster from "./quotemaster/quotemaster.js";
import * as myPlanner from "./myPlanner/myPlanner.js";

const APP = express();
APP.use(cors());
APP.use(express.json());

// API initialisation functions (where required)
quotemaster.init();
myPlanner.init();

// Handshaking route for frontends to check that API server is online
APP.all("/handshake", function (req, res) {
    res.status(200).end();
})

// quotemaster API interface
APP.get("/quotemaster/random", function (req, res) {
    const QUOTE = quotemaster.randomQuote();
    res.json(QUOTE);
});
APP.get("/quotemaster/popular", function (req, res) {
    const QUOTE = quotemaster.popularQuote();
    res.json(QUOTE);
});
APP.get("/quotemaster/id/:id", function (req, res) {
    try {
        const QUOTE = quotemaster.idQuote(req.params.id);
        res.json(QUOTE);
    } catch (err) {
        if (err instanceof quotemaster.idError) {
            res.status(400).json({
                "errorMessage": "Invalid quote ID"
            });
        } else {
            throw(err);
        }
    }
});
APP.post("/quotemaster/like", function (req, res) {
    try {
        quotemaster.likeQuote(req.body.id);
        res.status(200).end();
    } catch (err) {
        if (err instanceof quotemaster.idError) {
            res.status(400).json({
                "errorMessage": "Invalid quote ID"
            });
        } else {
            throw(err);
        }
    }
});
APP.post("/quotemaster/new", function (req, res) {
    try {
        let resObj = quotemaster.newQuote(req.body.quote, req.body.name);
        res.json(resObj);
    } catch (err) {
        if (err instanceof quotemaster.quoteError) {
            res.status(400).json({
                "errorMessage": "Quote must be between 1 and 400 characters long"
            });
        } else if (err instanceof quotemaster.nameError) {
            res.status(400).json({
                "errorMessage": "Name must be between 1 and 40 characters long"
            });
        } else {
            throw(err);
        }
    }
});
APP.post("/quotemaster/reset", function (req, res) {
    try {
        quotemaster.resetQuote(req.body.pass);
        res.status(200).end();
    } catch (err) {
        if (err instanceof quotemaster.passError) {
            res.status(403).json({
                "errorMessage": "Invalid password"
            });
        }
    }
});



APP.listen(5678);