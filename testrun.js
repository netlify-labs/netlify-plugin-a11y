const pa11y = require('pa11y');
const path = require('path');
const file = path.join(__dirname, '/demo/index.html');
(async function() {
  const res = await pa11y(file);
  console.log({ res: res.issues });
})();
