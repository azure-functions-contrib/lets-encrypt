const path = require('path');
const fs = require('fs');

module.exports = (options) => (context) => {
  let acmeChallengePath;
  if (options) {
    if (typeof options === 'string') {
      acmeChallengePath = options;
    } else if (typeof options.acmeChallengePath === 'string') {
      acmeChallengePath = options.acmeChallengePath;
    }
  }
  if (!acmeChallengePath) {
    // lets-encrypt/
    // @azure-functions-contrib/
    // node_modules/
    // MyFunction/
    // wwwroot/
    acmeChallengePath = path.resolve(__dirname, '../../../../../', '.well-known/acme-challenge');
  }
  const filePath = path.resolve(
    acmeChallengePath,
    context.bindingData.file
  );
  fs.access(filePath, fs.constants.R_OK, (err) => {
    if (err) {
      if (err.code === 'ENOENT') {
        context.done(err, {
          status: 404,
          body: 'Not Found',
        });
      } else {
        context.done(err, {
          status: 401,
          body: 'Unauthorized',
        });
      }
    } else {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          context.done(err, {
            status: 500,
            body: 'Internal Server Error',
          });
        } else {
          context.done(null, {
            status: 200,
            headers: {
              'content-type': 'text/plain; charset=utf-8',
            },
            body: data.toString(),
          });
        }
      });
    }
  });
};
