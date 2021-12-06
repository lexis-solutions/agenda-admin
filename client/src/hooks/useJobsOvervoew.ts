import { API_URL } from 'src/constants';
import useSWR from 'swr';

export default (name: string, property: string, value: string) =>
  useSWR(
    `${API_URL}/overview?name=${name}&property=${property}&value=${value}`
  );
