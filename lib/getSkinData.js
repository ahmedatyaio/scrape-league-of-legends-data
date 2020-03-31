const got = require('got');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const getSkinData = async champSkins => {
  const data = JSON.parse(champSkins);

  const handleChampMap = async champ => {
    try {
      const skins = champ.skins;
      const champSkins = await Promise.all(
        skins.map(skin => handleSkinMap(skin))
      );

      const champion = {
        name: champ.champName,
        champSkins
      };

      await fs.writeFile(
        `json/list/champions/${champ.champName}.json`,
        JSON.stringify(champion)
      );

      console.log('just created ' + champ.champName);

      return champion;
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSkinMap = async skin => {
    try {
      const name = skin.split(' ').join('_');
      const { body } = await got(`https://lol.gamepedia.com/${name}`);
      const $ = cheerio.load(body);

      const skinAvatar = $('.InfoboxSkin img').attr('src') || '';
      const skinSplash =
        $('.mw-parser-output p a.image img')
          .eq(1)
          .attr('src') || '';

      const skinInfo = {
        skinAvatar,
        skinSplash
      };

      const skinObj = {
        skinName: skin,
        skinInfo
      };

      return skinObj;
    } catch (err) {
      console.error(err.message);
    }
  };

  const ch = await Promise.all(data.map(champ => handleChampMap(champ)));
  await fs.writeFile('json/champions-skins-full.json', JSON.stringify(ch));

  return ch;
};

module.exports = getSkinData;
