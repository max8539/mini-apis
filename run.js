import express from "express";
import * as quotemaster from "./quotemaster/quotemaster.js";

const APP = express();

// quotemaster API interface
APP.get("/quotemaster/random", function (req, res) {
    const QUOTE = quotemaster.randomQuote();
    res.json(QUOTE);
})
APP.get("/quotemaster/popular", function (req, res) {
    const QUOTE = quotemaster.popularQuote();
    res.json(QUOTE);
})



APP.listen(5678);