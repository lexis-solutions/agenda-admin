import Autocomplete from 'react-autocomplete';
import cx from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchNames } from 'src/api';

interface PropsType {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  onSelect: (value: string, item: any) => void;
  renderInput?: (props: React.HTMLProps<HTMLInputElement>) => React.ReactNode;
  menuStyle?: React.CSSProperties;
  renderItem?: (
    item: any,
    isHighlighted: boolean,
    styles?: React.CSSProperties | undefined
  ) => React.ReactNode;
}

const JobNamesAutocomplete: React.FC<PropsType> = ({
  value,
  onChange,
  onSelect,
  renderInput,
  menuStyle,
  renderItem,
}) => {
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    fetchNames(value).then(({ data }) => setOptions(data));
  }, [value]);

  const defaultRenderInput = useCallback(
    (props) => (
      <input {...props} title={value} className="w-full input input-bordered" />
    ),
    [value]
  );

  const defaultMenuStyle: React.CSSProperties = useMemo(
    () => ({
      position: 'fixed',
      overflow: 'hidden',
      zIndex: 999,
      borderWidth: 2,
      borderRadius: 8,
      marginTop: 8,
    }),
    []
  );

  const defaultRenderItem = useCallback(
    (item, isHighlighted) => (
      <div
        key={item._id}
        className={cx('text-md p-2', {
          'bg-base-200': isHighlighted,
          'bg-base-100': !isHighlighted,
        })}
      >
        {item.name}
      </div>
    ),
    []
  );

  return (
    <Autocomplete
      menuStyle={{
        ...menuStyle,
        ...defaultMenuStyle,
        display: options.length === 0 ? 'none' : 'block',
      }}
      getItemValue={(item) => item.name}
      items={options}
      renderItem={renderItem || defaultRenderItem}
      renderInput={renderInput || defaultRenderInput}
      value={value}
      onChange={onChange}
      onSelect={onSelect}
    />
  );
};

export default JobNamesAutocomplete;
