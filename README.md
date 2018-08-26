# @azure-functions-contrib/lets-encrypt

A set of Azure Functions for the Let's Encrypt Site Extension.

This project is still a work in progress, more documentation to come.

## Functions

Module | Description
--- | --- 
`@azure-functions-contrib/lets-encrypt/renew` | Renews any certificates that are near to their expiration date.
`@azure-functions-contrib/lets-encrypt/acme-challenge` | Serves the `.well-known/acme-challenge` folder.

## Example usage

### `@azure-functions-contrib/lets-encrypt/renew`

The following example is a cron that triggers the Let's Encrypt Site Extension to auto-renew any certificates that are near to expiring. This example runs every week (on Sunday), but can be configured to run whenever you like.

You can control when the certificates are renewed by setting the `letsencrypt:RenewXNumberOfDaysBeforeExpiration` app setting. The default is 22 days.

#### function.json

```json
{
  "bindings": [
    {
      "name": "timer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 0 0 * * 0"
    }
  ],
  "disabled": false
}
```

#### index.js

```js
module.exports = require('@azure-functions-contrib/lets-encrypt/renew')();
```

### `@azure-functions-contrib/lets-encrypt/acme-challenge`

The following example serves the `.well-known/acme-challenge` folder. It does not require any configuration by default, but can be passed the absolute path to the `acme-challenge` folder.

#### function.json

```json
{
  "bindings": [
    {
      "authLevel": "anonymous",
      "name": "req",
      "type": "httpTrigger",
      "direction": "in",
      "methods": [
        "get"
      ],
      "route": ".well-known/acme-challenge/{*file}"
    },
    {
      "name": "res",
      "type": "http",
      "direction": "out"
    }
  ],
  "disabled": false
}
```

#### index.js

```js
module.exports = require('@azure-functions-contrib/lets-encrypt/acme-challenge')({
  acmeChallengePath: 'D:\\home\\site\\wwwroot\\.well-known\\acme-challenge', // optional
});
```

## License

MIT ❤️
