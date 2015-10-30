# Kick-Happy/Api
A HapiJS API backend kickstarter

> Don't use, under development

## Intro

Kick-Happy-Api (aka KH/A - differs of the front version called KH/W) is a simple kickstarter for your Node.JS projects using the HapiJS framework.
KHA give a simple approche and the good way to start the development of your next API as fast as possible.

## Requirements

- You need to setup a mongodb server
- That's all :)

## Quickstart

```zsh
git clone git@github.com:paulrad/kick-happy-api.git ./my-project
cd my-project
npm i --production
node index.js
```

Then..

```zsh
curl -i -X HEAD http://localhost:3000
```

Expected response is :

```
HTTP/1.1 200 OK
cache-control: no-cache
Date: Thu, 29 Oct 2015 19:38:02 GMT
Connection: keep-alive
```

```zsh
# Create a new user
curl --data "email=mickey@mouse.com" -i -X POST http://localhost:3000/users
```

```zsh
curl -i -X GET http://localhost:3000/users
```

Will return

```zsh
HTTP/1.1 200 OK
content-type: application/json; charset=utf-8
cache-control: no-cache
content-length: 110
accept-ranges: bytes
Date: Thu, 29 Oct 2015 20:31:42 GMT
Connection: keep-alive

[{"_id":"56328227e7ff9b7066ca564a","email":"mickey@mouse.com","__v":0,"createdAt":"2015-10-29T20:31:35.612Z"}]%
```

## Tests

```zsh
npm i -g mocha && npm i && mocha
```

## Development

KH/A uses the following dependencies : hapijs, mongoose, bluebird, config.

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
    - helpers.js
    - routes.js
  - index.js

#### /config

The config directory contains the configurations files. The node plugin [node-config](https://github.com/lorenwest/node-config) will load the good json file according your current `NODE_ENV` value.

The default json configuration file loaded will be `default.json`. If your load an other configuration file (eg: `export NODE_ENV=production`), properties of the `production.json` will override the defaults properties.

Your configurations properties are accessibles via the method `KH.config()`

#### /helpers

The helpers files are accessible globally via the method `KH.Helpers` (eg: `KH.helpers('models/users')` will return all the methods of the `helpers/models/users.js` file - see the API chapter for more informations about the KA global object).

The helpers directory is subdivided in (actually) 4 subdirectories:

##### /hapi

Contains by default the file `auth_strategies.js`.

We can use this directory to store invokations of yours HapiJS plugins. The HapiJS `server` object is accessible via the method `KH.server()`

##### /mongoose

Could contains yours mongoose plugins, for example.

##### /models

The `models` directory could contains helpers to help the work on yours mongoose collections.

#### /models

The `models` directory actually contains one subdirectory (mongoose) which is intended to host yours mongoose models.

#### /routes

The `routes` directory contains the routes used by the HapiJS framework.

### Models

The basic models structure is :

```javascript
var Types = require('mongoose').Schema.Types;

module.exports = {

  // Is required only in the case where your use multiple mongodb connections
  database: 'my_mongo_database',

  // The name of your collection
  name: 'my_collection',

  // The mongoose schema
  schema: {
    name: {
      type: String
    },

    user: {
      type: Types.ObjectId,
      ref: 'users'
    }
  },

  // An array of the plugins automatically registered on this Schema
  plugins: [
    'lastModified' // will automatically link your plugin lastModified presents in the helpers/mongoose/ directory
  ],

  // List of methods accessibles
  methods: {
    'myMethod': function() {

    }
  },
  
  // List of statics accessibles
  statics: {
    'myStatic': function() {

    }
  }

};
```

#### How can i invoke a model ?

Simply call `KH.model('collection')` or `KH.model('database.collection')`. It returns a registered mongoose model.

```javascript
// Example
KH.model('database1.users').findOne({email: 'mickey@mouse.com'}).exec();
```

If the model asked isn't accessible, KH.Model throw an exception.

### Routes

Yours routes files *must returns* an array of valid [HapiJS routes](http://hapijs.com/tutorials/routing).

You can save your routes in the main routes directory or in subdirectories if your want.

#### How can i create new routes ?

```javascript
// Example routes
// @file routes/index.js
module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function(req, reply) {
      reply().code(200);
    }
  },

  {
    method: 'GET',
    path: '/current_time',
    handler: function(req, reply) {
      reply({
        'current_time': + new Date()
      }).code(200);
    }
  }
];
```

## API

### `KH`

Is a global object accessible everywhere in your code.

#### `KH.controller`

#### `KH.helper`

#### `KH.model`

#### `KH.server`

Returns the `server` object invoked by `new Hapi.Server()`.

##### Usage
`KH.server();`

##### Arguments
No argument

##### Returns
Will returns the Hapi.Server instance.
