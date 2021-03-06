const rp = require('request-promise');
const $ = require('cheerio');

const comicParse = function(url) {
    return rp(url)
        .then(function(html) {
            return {
                name: $('.firstHeading', html).text(),
                birthday: $('.bday', html).first().text(),
            };
        })
        .catch(function(err) {
            //handle error
        });
};

module.exports = comicParse;