const download = require('image-downloader');
const path = require('path');
const fs = require('fs');

const downloadSkins = async jsonFile => {
  const data = JSON.parse(jsonFile);

  //   const handleChamp = async champion => {
  //     const champName = champion.name
  //       .toLowerCase()
  //       .split(' ')
  //       .join('-');
  //     const dir = path.resolve(__dirname, '..', 'downloads/skins/', champName);

  //     if (!fs.existsSync(dir)) {
  //       fs.mkdirSync(dir);
  //     }

  //     await Promise.all(
  //       champion.champSkins.map(skin => {
  //         const skinName = skin.skinName
  //           .toLowerCase()
  //           .split(' ')
  //           .join('-');

  //         const subfolderDir = path.resolve(
  //           __dirname,
  //           '..',
  //           'downloads/skins/',
  //           champName,
  //           skinName
  //         );
  //         fs.mkdirSync(subfolderDir);
  //       })
  //     );
  //   };

  const handleDownload = async champion => {
    await Promise.all(
      champion.champSkins.map(skin => handleMap(skin, champion.name))
    );
  };

  const handleMap = async (skin, name) => {
    const { skinName, skinInfo } = skin;

    const champNameSlug = name
      .toLowerCase()
      .split(' ')
      .join('-');

    const skinNameSlug = skinName
      .toLowerCase()
      .split(' ')
      .join('-');

    if (skinInfo) {
      try {
        // const options = {
        //   url: skinInfo.skinAvatar,
        //   dest: path.resolve(
        //     __dirname,
        //     '..',
        //     `downloads/skins/${champNameSlug}/${skinNameSlug}/avatar.png`
        //   ),
        //   extractFilename: false
        // };

        // const { filename, image } = await download.image(options);
        // console.log('successfully downloaded ' + filename);
        const options = {
          url: skinInfo.skinSplash,
          dest: path.resolve(
            __dirname,
            '..',
            `downloads/skins/${champNameSlug}/${skinNameSlug}/splash.jpg`
          ),
          extractFilename: false
        };

        if (!fs.existsSync(options.dest)) {
          const { filename, image } = await download.image(options);
          console.log('successfully downloaded ' + filename);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  return await Promise.all(data.map(champion => handleDownload(champion)));
};

module.exports = downloadSkins;
