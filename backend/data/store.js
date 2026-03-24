const path = require('path');
const fs = require('fs/promises');

const readJson = async (fileName) => {
  const filePath = path.join(__dirname, fileName);
  const fileContent = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContent);
};

const getAttractions = () => readJson('attractions.json');
const getWildlife = () => readJson('wildlife.json');
const getTrails = () => readJson('trails.json');

module.exports = {
  getAttractions,
  getWildlife,
  getTrails,
};
