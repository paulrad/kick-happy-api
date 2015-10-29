# Kick-Happy/Api
A HapiJS API backend kickstarter

## Intro

Kick-Happy-Api (aka KH/A - differs of the front version called KH/W) is a simple kickstarter for your Node.JS projects using the HapiJS framework.
KHA give a simple approche and the good way to start the development of your next API as fast as possible.

## Quickstart

```bash
git clone git@github.com:paulrad/kick-happy-api.git ./my-project
cd my-project
npm i --production
node index.js
```

## Development

KH/A uses the following dependencies : hapijs, mongoose, bluebird, node-config.

### Structure

  - /config
    - default.json
    - testing.json
    - production.json
  - /helpers
    - /hapi
      - auth_strategies.js
    - /mongoose
    - /models
    - /routines
  - /models
    - /mongoose
      - users.js
  - /routes
    - index.js
    - users.js
  - /sys
    - hapi.js
    - models.js
  - index.js

#### /config

The config directory contains the configurations files. The node plugin [node-config](https://github.com/lorenwest/node-config) will load the good json file according your current `NODE_ENV` value.

The default json configuration file loaded will be `default.json`. If your load an other configuration file (eg: `export NODE_ENV=production`), properties of the `production.json` will override the defaults properties.

#### /helpers

The helpers files are accessible globally via the method `KH.Helpers` (eg: `KH.Helpers('models/users')` will return all the methods of the `helpers/models/users.js` file - see the API chapter for more informations about the KA global object).

The helpers directory is subdivided in (actually) 4 subdirectories:

##### /hapi

Contains by default the file `auth_strategies.js`.

##### /mongoose

Could contains yours mongoose plugins, for example.

##### /models

Could contains helpers to help the work on yours mongoose collections.

#### /models

The models directory actually contains one subdirectory (mongoose) which is intended to host yours mongoose models.