const rp = require('request-promise');
const $ = require('cheerio');
const potusParse = require('./potusParse');
const url = 'http://www.coverbrowser.com/search?q=marvel';

// This runs through the page's 30 comics and prints out the links to the images
rp(url)
    .then(function(html) {
        //success!
        const comicImages = [];
        for (let i = 0; i < 30; i++) {
            comicImages.push($('p > a > img', html)[i].attribs.src);
        }

        comicImages.forEach((link) => {
            let name = link.substring(7,link.lastIndexOf("/"));
            let issue = link.substring(link.lastIndexOf("/") + 1, link.length -6);
            let image = link;
            console.log(`name: ${name} \n issue: #${issue} \n image: http://www.coverbrowser.com${image} \n`);
        });

        // return Promise.all(
        //     comicImages.map(function(url) {
        //         return comicParse('http://www.coverbrowser.com' + url);
        //     })
        // );
    })

    // .then(function(presidents) {
    //     console.log(presidents);
    // })

    .catch(function(err) {
        //handle error
        console.log(err);
    });