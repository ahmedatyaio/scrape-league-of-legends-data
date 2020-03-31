const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const getHrefs = () => {
  return new Promise((resolve, reject) => {
    request(
      'https://na.leagueoflegends.com/en-us/champions/',
      async (err, res, html) => {
        if (!err && res.statusCode == 200) {
          const $ = cheerio.load(html);

          let champions = [];
          let hrefs = [];

          $('.style__Wrapper-sc-12h96bu-0').each((i, el) => {
            const href = 'https://na.leagueoflegends.com/' + $(el).attr('href');
            const champion = $(el)
              .find('.style__Text-sc-12h96bu-3')
              .text();

            const champ = {
              id: i + 1,
              champion
            };

            champions.push(champ);
            hrefs.push(href);
          });

          await fs.writeFile(
            'json/list/champions.json',
            JSON.stringify(champions)
          );
          await fs.writeFile('json/info/hrefs.json', JSON.stringify(hrefs));

          resolve(hrefs);
        } else {
          reject(err);
        }
      }
    );
  });
};

module.exports = getHrefs;
