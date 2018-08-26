# @azure-functions-contrib/lets-encrypt

A set of Azure Functions for the Let's Encrypt Site Extension.

This project is still a work in progress, more documentation to come.

## Functions

Name | Description | Module
--- | --- | ---
Renew | Renews any certificates that are near to their expiration date. | `@azure-functions-contrib/lets-encrypt/renew`

## Example usage

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
