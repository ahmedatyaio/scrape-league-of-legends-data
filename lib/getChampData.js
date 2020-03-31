const got = require('got');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const getChampData = async hrefs => {
  const requests = hrefs.map(async href => {
    try {
      // const html = await axios.get(href);
      const { body } = await got(href);
      const $ = cheerio.load(body);

      const champName = $('.style__Title-sc-14gxj1e-3 span').text();

      let skins = [];

      $('.style__CarouselItemText-sc-1tlyqoa-16').each((_, el) => {
        const skinName = $(el).text();
        skins.push(skinName);
      });

      const champion = {
        champName,
        skins
      };

      return champion;
    } catch (err) {
      console.error(err.message);
    }
  });

  try {
    const results = await Promise.all(requests);
    await fs.writeFile('json/info/skins-hrefs.json', JSON.stringify(results));

    return results;
  } catch (err) {
    console.error(err);
  }
};

module.exports = getChampData;

// const got = require('got');
// const pMap = require('p-map');
// const cheerio = require('cheerio');
// const fs = require('fs').promises;

// const getChampData = async hrefs => {
//   // const champions = JSON.parse(await fs.readFile('json/champions.json'));

//   try {
//     let champsList = await pMap(hrefs, async ({ href }) => {
//       const { body } = await got(href);

//       const $ = cheerio.load(body);

//       const champName = $('.style__Title-sc-14gxj1e-3 span').text();

//       let skins = [];

//       $('.style__CarouselItemText-sc-1tlyqoa-16').each((_, el) => {
//         const skinName = $(el).text();
//         skins.push(skinName);
//       });

//       const champion = {
//         champName,
//         skins
//       };

//       console.log(champion);

//       return champion;
//     });
//     await fs.writeFile(
//       'champions-with-skins-list.json',
//       JSON.stringify(champsList)
//     );
//   } catch (err) {
//     console.error(err.message);
//   }
// };

// const functionWithPromise = href => {
//   return Promise.resolve(
//     request(href, (err, res, html) => {
//       if (!err && res.statusCode == 200) {
//         const $ = cheerio.load(html);
//         const champName = $('.style__Title-sc-14gxj1e-3 span').text();

//         let skins = [];

//         $('.style__CarouselItemText-sc-1tlyqoa-16').each((_, el) => {
//           const skinName = $(el).text();
//           skins.push(skinName);
//         });

//         const champion = {
//           champName,
//           skins
//         };

//         champions.push(champion);
//       }
//     })
//   );
// };

// const asyncCall = async href => {
//   return await functionWithPromise(href);
// };

// const getChampData = hrefs => {
//   Promise.all(hrefs.map(({ href }) => asyncCall(href))).then(() => {
//     return champions;
//   });
// };

// const got = require('got');
// const pMap = require('p-map');
// const cheerio = require('cheerio');
// const fs = require('fs').promises;

// const arr = [];

// (async () => {
//   const champs = JSON.parse(
//     await fs.readFile('champions-with-skins-list.json', 'utf8')
//   );

//   try {
//     const champsList = await pMap(champs, async champ => {
//       const skins = champ.skins;
//       const skinsList = await pMap(skins, async skin => {
//         const name = skin.split(' ').join('_');

//         const { body } = await got(`https://lol.gamepedia.com/${name}`);

//         const $ = cheerio.load(body);

//         const skinLink = $('.InfoboxSkin img').attr('src') || '';

//         const skinInfo = {
//           skinName: skin,
//           skinLink
//         };

//         return skinInfo;
//       });

//       skins.splice(0, skins, ...skinsList);
//       return champ;
//     });

//     addToArray(champsList).then(async () => {
//       await fs.writeFile('skins-list.json', JSON.stringify(arr));
//     });
//   } catch (error) {
//     console.log(error.message);
//   }
// })();

// const addToArray = obj => {
//   return new Promise((resolve, reject) => {
//     arr.push(obj);

//     const err = false;

//     if (!err) {
//       resolve();
//     } else {
//       reject('Error.');
//     }
//   });
// };
