import Agenda from 'agenda';

if (!process.env.CONNECTION_STRING) {
  throw new Error('No mongoDB connection string provided!');
}

const agenda = new Agenda({
  db: {
    address: process.env.CONNECTION_STRING,
    collection: process.env.COLLECTION,
  },
});

export default agenda;
