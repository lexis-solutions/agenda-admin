import { ITEMS_PER_PAGE } from './constants';

export type OptionsType =
  | {
      itemsPerPage?: number;
      username?: string;
      password?: string;
    }
  | undefined;

let options: OptionsType;

export const setOptions = (newOptions: OptionsType) => {
  options = newOptions;
};

export const getOptions = () => ({
  itemsPerPage: options?.itemsPerPage || ITEMS_PER_PAGE,
  username: options?.username || 'admin',
  password: options?.password || '',
});
