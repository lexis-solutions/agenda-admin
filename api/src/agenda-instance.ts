import Agenda from 'agenda';

let agendaInstance: Agenda;

export const getAgendaInstance = () => {
  if (!agendaInstance) {
    if (!process.env.CONNECTION_STRING) {
      throw new Error('No mongoDB connection string provided!');
    }

    agendaInstance = new Agenda(
      {
        db: {
          address: process.env.CONNECTION_STRING,
          collection: process.env.COLLECTION,
        },
      },
      (error) => {
        if (error) {
          console.error('Unable to connect to the database: ' + error.message);
          process.exit(1);
        }
      }
    );
  }

  return agendaInstance;
};

export const setAgendaInstance = (newInstance: Agenda) => {
  agendaInstance = newInstance;
};
