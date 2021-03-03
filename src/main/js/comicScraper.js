const rp = require('request-promise');
const $ = require('cheerio');
const potusParse = require('./potusParse');
const url = 'http://www.coverbrowser.com/search?q=';
const pageCount = 4;
const sql = require('mssql')

run();

async function run() {
    await sql.connect('mssql://stephan:pass123@localhost/ComicStore');
    const result = await sql.query(`SELECT Title AS Title, STRING_AGG(SeriesNumber,',') AS Series FROM Issues GROUP BY Title`);
    // console.dir(result)

    for (const row of result.recordset) {
        const comicURL = (`${url}${encodeURI(row.Title)}`);
        console.log(comicURL);
        const html = await rp(comicURL)
        console.log(parseHtml(html, comicURL));
    }
}

async function parseHtml(html, comicURL) {
    const comicMap = new Map();
    const searchIntro = $('.searchIntro', html);

    if (!searchIntro || !searchIntro[0]) {
        return comicMap;
    }

    const searchIntroText = searchIntro.text().replace("Results ", "").replace(" - ", "|").replace(" of ", "|").replace(",", "");
    const parts = searchIntroText.split("|");
    let from = parseInt(parts[0]);
    let to = parseInt(parts[1]);
    const results = parseInt(parts[2]);
    const pages = results/30;

    for (let i=2; i<=pages; i++) {
        const images = getImages(html,to - from + 1, comicMap)
        html = await rp(`${comicURL}&page=${i}`)
        comicMap.add()
    }
    console.log(intOfResults)

    return comicMap;
}

// Soek loop wat issue + image
function getImages(html, imagePerPage, map) {
     for (let i=0; i<imagePerPage; i++) {
         map.add()
     }
}