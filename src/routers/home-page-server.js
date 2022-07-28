const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const getGoogleOauthUrl = require('../utils/get-google-url');

const router = Router();

router.get('/', (req, res) => {
  const homepageHtml = fs.readFileSync(path.resolve(__dirname, '../views/homepage.html'));
  const handleBarTemp = handlebars.compile(homepageHtml.toString());
  const template = handleBarTemp({ link: getGoogleOauthUrl() });
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(template);
});

module.exports = router;
