const rp = require('request-promise');
const $ = require('cheerio');
const potusParse = require('./potusParse');
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';

// This logs all the inidividual president url's
// rp(url)
//     .then(function(html){
//         //success!
//         const wikiUrls = [];
//         for (let i = 0; i < 46; i++) {
//             wikiUrls.push($('td > b > a', html)[i].attribs.href);
//         }
//         console.log(wikiUrls);
//     })
//     .catch(function(err){
//         //handle error
//     });

// This runs all the individual url's through the potusParse function, which gets the name and bday
rp(url)
    .then(function(html) {
        //success!
        const wikiUrls = [];
        for (let i = 0; i < 46; i++) {
            wikiUrls.push($('td > b > a', html)[i].attribs.href);
        }
        return Promise.all(
            wikiUrls.map(function(url) {
                return potusParse('https://en.wikipedia.org' + url);
            })
        );
    })
    .then(function(presidents) {
        console.log(presidents);
    })
    .catch(function(err) {
        //handle error
        console.log(err);
    });