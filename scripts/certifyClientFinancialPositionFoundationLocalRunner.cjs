const jiti = require('jiti')(__filename);
const { certifyClientFinancialPositionFoundationLocal } = jiti('./certifyClientFinancialPositionFoundationLocal.ts');

const keepAlive = setInterval(() => undefined, 1_000);
certifyClientFinancialPositionFoundationLocal()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(() => clearInterval(keepAlive));
