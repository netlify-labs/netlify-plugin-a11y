const pa11y = require('pa11y');
const path = require('path');
(async function() {
  const res = await pa11y(path.join(__dirname, '/demo/index.html'));
  console.log({ res: res.issues });
})();
