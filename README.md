# Agenda Admin
A Dashboard for [Agenda](https://github.com/agenda/agenda)

---

### Features

- Jobs status, refresh interval is 15 seconds by default
- Search jobs by name, including autocomplete
- Filter jobs by metadata and status
- View job details
- Delete and requeue jobs
- Schedule a new job

---

### Prerequisites

Required version of MongoDB: >2.6.0

---

### Middleware usage
Agenda Admin can be used as express middleware, using the `mountAgendaAdmin` function. As an argument, it takes an object with the following fields:
- `publicUrl` - the URL at which the the middleware should be mounted
- `expressApp` - the express app
- `agenda` - an agenda instance

#### Example:

```
const express = require('express');
const Agenda = require('agenda');
const { mountAgendaAdmin } = require('agenda-admin');

const app = express();

// Other express middleware

const agenda = new Agenda({ db: { address: 'mongodb://127.0.0.1/agendaDb' } });

mountAgendaAdmin({ 
  publicUrl: 'http://localhost:4000/agenda-admin',
  expressApp: app, 
  agenda
});

app.listen(4000);
```

---

### Docker usage
```
docker run -p 4000:4000 \ 
--env CONNECTION_STRING=mongo://username:password@host/database \
--env COLLECTION=collection
```

---

### Environment configuration

| name                       | description                                                     | required | default value |
|----------------------------|-----------------------------------------------------------------|----------|---------------|
| CONNECTION_STRING          | MongoDB connection string                                       | yes      |               |
| COLLECTION                 | MongoDB collection of jobs                                      | no       | agendaJobs    |
| AGENDA_USERNAME            | username                                                        | no       | admin         |
| AGENDA_PASSWORD            | If no password is provided, no  authentication will be required | no       |               |
| REACT_APP_ITEMS_PER_PAGE   | Number of jobs per page                                         | no       | 20            |
| REACT_APP_REFRESH_INTERVAL | Jobs list refresh interval in milliseconds                      | no       | 15000         |
---

### Contributing

#### Install dependencies

`yarn install`

#### Running

Inside the `api` directory create an `.env.development` file with `CONNECTION_STRING` and `COLLECTION` variables, then run `yarn dev`. \
You can also run `yarn start` in the `api` and `client` directories.


#### Running tests

Inside the `api` directory create an `.env.testing` file with `CONNECTION_STRING` and `COLLECTION` variables, then run `yarn test`.

#### Commit messages

Agenda Admin uses [conventional commits format](https://www.conventionalcommits.org/en/v1.0.0/).