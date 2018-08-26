const request = require('request');
const msRestAzure = require('ms-rest-azure');
const WebSiteManagementClient = require('azure-arm-website');

module.exports = () => (context) => {
  const clientId = process.env['letsencrypt:ClientId'];
  const clientSecret = process.env['letsencrypt:ClientSecret'];
  const tenant = process.env['letsencrypt:Tenant'];
  const subscriptionId = process.env['letsencrypt:SubscriptionId'];
  const resourceGroupName = process.env['letsencrypt:ResourceGroupName'];
  const appName = process.env['WEBSITE_SITE_NAME'];

  msRestAzure.loginWithServicePrincipalSecret(clientId, clientSecret, tenant, (err, credentials) => {
    if (err) {
      context.error(err);
      context.done();
      return;
    }

    const client = new WebSiteManagementClient(credentials, subscriptionId);

    client.webApps.listPublishingCredentials(resourceGroupName, appName, (err, profile) => {
      if (err) {
        context.error(err);
        context.done();
        return;
      }

      const { scmUri } = profile;
      const apiPath = '/letsencrypt/api/certificates/renew?api-version=2017-09-01';

      request.post(scmUri + apiPath, (err, response, body) => {
        if (err) {
          context.error(err);
          context.done();
          return;
        }

        const { statusCode } = response;
        const contentType = response.headers['content-type'].split(';')[0];

        if (statusCode !== 200 || contentType !== 'application/json') {
          context.warn('Unknown/unsuccessful response from API.');
          context.log(`Status Code: ${statusCode}, Content Type: ${contentType}`);
          context.log(body.toString());
        }

        else {
          const renewed = JSON.parse(body.toString());

          if (renewed.length) {
            context.log(`Successfully renewed ${renewed.length} certificate(s).`);
            renewed.forEach(info => context.log(` - ${info.Host}`));
          } else {
            context.log('No certificates to renew.');
          }
        }

        context.done();
      })
    });
  });
};
