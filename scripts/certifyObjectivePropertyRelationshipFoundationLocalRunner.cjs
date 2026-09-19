const jiti = require('jiti')(__filename);
const { certifyObjectivePropertyRelationshipFoundationLocal } = jiti('./certifyObjectivePropertyRelationshipFoundationLocal.ts');

const keepAlive = setInterval(() => undefined, 1_000);
console.log('[objective-property-relationship-local] starting guarded certification.');

certifyObjectivePropertyRelationshipFoundationLocal()
  .then(() => console.log('[objective-property-relationship-local] guarded certification completed.'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => clearInterval(keepAlive));
