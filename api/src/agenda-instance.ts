import Agenda from 'agenda';

let agendaInstance: Agenda;

export const getAgendaInstance = () => {
  if (!agendaInstance) {
    if (!process.env.CONNECTION_STRING) {
      throw new Error('No mongoDB connection string provided!');
    }

    agendaInstance = new Agenda({
      db: {
        address: process.env.CONNECTION_STRING,
        collection: process.env.COLLECTION,
      },
    });
  }

  return agendaInstance;
};

export const setAgendaInstance = (newInstance: Agenda) => {
  agendaInstance = newInstance;
};
