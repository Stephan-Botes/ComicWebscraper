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

    for (const row in result.recordset) {
        const html = await rp(`${url}${row.Title}`)
        console.log(parseHtml(html));
    }
    // const html = await rp(url);
    //
    // for (let i = 2; i <= pageCount; i++) {
    //     console.log(i);
    //     const newHtml = await rp(`${url}&page=${i}`);
    //     parseHtml(newHtml)
    // }
}

async function parseHtml(html) {
    //success!
    const comicImages = [];
    const comicMap = new Map();
    const imageCheck = $('p > a > img', html);

    if (!imageCheck || !imageCheck[0]) {
        return comicMap;
    }

    for (let i = 0; i < 30; i++) {
        comicImages.push($('p > a > img', html)[i].attribs.src);
    }

    comicImages.forEach((link) => {
        let name = link.substring(7, link.lastIndexOf("/"));
        let issue = link.substring(link.lastIndexOf("/") + 1, link.length - 6);
        let image = link;

        if (!comicMap.has(issue)) {
            comicMap.add(issue, `http://www.coverbrowser.com${image}`);
        }
    });

    return comicMap;
}