const path = require('path');
const fs = require('fs').promises;

const getSkinData = async champSkins => {
  const data = JSON.parse(champSkins);

  const handleChampMap = async champ => {
    try {
      const skins = champ.skins;
      const champSkins = await Promise.all(
        skins.map(skin => handleSkinLocation(skin, champ.champName))
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

  const handleSkinLocation = async (skin, champName) => {
    try {
      const name = skin
        .toLowerCase()
        .split(' ')
        .join('-');

      const skinInfo = {
        skinAvatar: path.resolve(
          __dirname,
          '..',
          'downloads/skins/',
          champName,
          name,
          'avatar.png'
        ),
        skinSplash: path.resolve(
          __dirname,
          '..',
          'downloads/skins/',
          champName,
          name,
          'splash.jpg'
        )
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
