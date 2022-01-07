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

Coming soon

---

### Docker usage
```
docker run -p 4000:4000 \ 
--env CONNECTION_STRING=mongo://username:password@host/database \
--env COLLECTION=collection
```

---

### Environment configuration

#### CONNECTION_STRING

MongoDB connection string.

#### COLLECTION

MongoDB collection of jobs, default collection name is agendaJobs

#### AGENDA_USERNAME

Default username is admin

#### AGENDA_PASSWORD

If no password is provided, no authentication will be required

#### REACT_APP_ITEMS_PER_PAGE

Items per page(optional, default value is 20)

#### REACT_APP_REFRESH_INTERVAL

Jobs list refresh interval(optional, default value is 15000 milliseconds)

---

### Contributing

#### Install dependencies

`yarn install`

#### Running

Inside the `api` directory create an `.env.development` file with `CONNECTION_STRING` and `COLLECTION` variables, then run `yarn dev`. \
You can also run `yarn start` in the `api` and `client` directories.


#### Running tests

Inside the `api` directory create an `.env.testing` file with `CONNECTION_STRING` and `COLLECTION` variables, then run `yarn test`.
