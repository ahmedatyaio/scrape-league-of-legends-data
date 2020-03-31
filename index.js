const getHrefs = require('./lib/getHrefs');
const getChampData = require('./lib/getChampData');
const downloadSkins = require('./lib/downloadSkins');
const getSkinData = require('./lib/getSkinData');
const generateFinalFile = require('./lib/generateFinalFile');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

(async () => {
  try {
    // Generates 2 different json files with the champion names and official riot link for each champion's page that includes data about them like their skin names which we'll use later

    // NOTE: it only returns the hrefs data as an array to use for the next process
    let hrefs = null;
    const hrefsJson = path.resolve(__dirname, 'json/info/hrefs.json');
    if (!fs.existsSync(hrefsJson)) {
      console.log('generating the hrefs file');
      hrefs = await getHrefs();
    } else {
      console.log('getting data from the pre-made file');
      hrefs = await fsPromises.readFile('json/info/hrefs.json');
    }

    // Generates a file with skin names of every champion of the champions that came from the hrefs file passed from the previous function then returns the data as an array used in the next function
    let skinHrefs = null;
    const skinHrefsJson = path.resolve(__dirname, 'json/info/skins-hrefs.json');
    if (!fs.existsSync(skinHrefsJson)) {
      console.log('generating the skin hrefs file');
      skinHrefs = await getChampData(hrefs);
    } else {
      console.log('getting data from the pre-made file');
      skinHrefs = await fsPromises.readFile('json/info/skins-hrefs.json');
    }

    // Extends the previous record with a link to the splash and avatar of each skin provided from the function above

    let dataToDownload = null;
    const dataToDownloadJson = path.resolve(
      __dirname,
      'json/champions-skins-full.json'
    );
    if (!fs.existsSync(dataToDownloadJson)) {
      console.log('getting skin links for each champion');
      dataToDownload = await getSkinData(skinHrefs);
    } else {
      console.log('getting data from the pre-made file');
      dataToDownload = await fsPromises.readFile(
        'json/champions-skins-full.json'
      );
    }

    // Downloads all the data as downloads/skin/:champ-name/skin-name/file
    // await downloadSkins(dataToDownload);

    await generateFinalFile(skinHrefs);

    console.log('process done');
  } catch (err) {
    console.error(err.message);
  }
})();
