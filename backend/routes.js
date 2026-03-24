const express = require('express');
const { getAttractions, getWildlife, getTrails } = require('./data/store');

const router = express.Router();

router.get('/attractions', async (req, res, next) => {
  try {
    const attractions = await getAttractions();
    res.json({ data: attractions });
  } catch (error) {
    next(error);
  }
});

router.get('/wildlife', async (req, res, next) => {
  try {
    const wildlife = await getWildlife();
    res.json({ data: wildlife });
  } catch (error) {
    next(error);
  }
});

router.get('/trails', async (req, res, next) => {
  try {
    const trails = await getTrails();
    res.json({ data: trails });
  } catch (error) {
    next(error);
  }
});

router.get('/offline-pack', async (req, res, next) => {
  try {
    const [attractions, wildlife, trails] = await Promise.all([
      getAttractions(),
      getWildlife(),
      getTrails(),
    ]);

    res.json({
      data: {
        generatedAt: new Date().toISOString(),
        mapTiles: { strategy: 'remote-placeholder', version: 'v1' },
        attractions,
        wildlife,
        trails,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
