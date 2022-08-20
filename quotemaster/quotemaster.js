import fs from "fs";
import path from "path";
const QUOTES_JSON = "./quotemaster/quotes.json"

export function randomQuote () {
    const DATA = JSON.parse(fs.readFileSync(QUOTES_JSON));
    let num = DATA.quotes.length;
    let index = Math.floor(Math.random() * num);
    return DATA.quotes[index];
}

export function popularQuote () {
    const DATA = JSON.parse(fs.readFileSync(QUOTES_JSON));
    let popular = DATA.quotes.filter(item => item.likes >= DATA.maxLikes * 0.75);
    let num = popular.length;
    let index = Math.floor(Math.random() * num);
    return popular[index];
}