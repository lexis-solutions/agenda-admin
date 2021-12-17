import { ObjectId } from 'mongodb';

export const buildJobQuery = ({
  name,
  property,
  value,
}: {
  name: string | null;
  property: string | null;
  value: string | null;
}) => {
  const query: any = {};
  if (name) {
    query.name = name;
  }

  if (property && value) {
    if (property.endsWith('_id')) {
      query[property] = new ObjectId(value);
    } else {
      query[property] = /^\d+$/.test(value) ? +value : value;
    }
  } else if (property) {
    query[property] = { $exists: true };
  }

  return query;
};
