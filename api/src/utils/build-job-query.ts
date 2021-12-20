import { ObjectId } from 'mongodb';
import { StatusType } from 'src/types';

export const buildJobQuery = ({
  name,
  property,
  value,
  status,
  sortBy,
  sortType,
}: {
  name: string | null;
  property: string | null;
  value: string | null;
  status: StatusType | null;
  sortBy: 'lastRunAt' | 'nextRunAt';
  sortType: 'desc' | 'asc';
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

  const statusFilter: any = {};
  if (status) {
    statusFilter[`status.${status}`] = true;
  }

  return {
    query,
    statusFilter,
    sortBy: sortBy || 'lastRunAt',
    sortType: sortType === 'asc' ? 1 : -1,
  };
};
