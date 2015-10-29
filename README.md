# kick-happy-api
A HapiJS API backend kickstarter

## Intro

Kick-Happy-Api (aka KHA) is a simple kickstarter for your Node.JS projects using the HapiJS framework.
KHA give a simple approche and the good way to start the development of your next API as fast as possible.

## Quickstart

```bash
git clone git@github.com:paulrad/kick-happy-api.git ./my-project
cd my-project
npm i --production
node index.js
```

## Development

KHA uses the following dependencies : hapijs, mongoose, mysql, knex, bluebird, node-config.

### Structure

  - config
  - helpers
    - hapi
    - mongoose
    - models
  - models
    - mongodb
    - mysql
  - routes
  index.js