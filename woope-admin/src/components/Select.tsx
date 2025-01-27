interface Props {
  className?: string;
  options?: string[];
  values?: string[];
  id?: string;
  selected?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = ({
  options = [],
  values = [],
  id,
  className,
  selected = "",
  onChange,
}: Props) => {
  return (
    <select
      className={`form-select ${className}`}
      aria-label="Default select example"
      id={id}
      onChange={onChange}
    >
      <option selected>{selected}</option>
      {options.map((e, index) => {
        return (
          <option value={index < values.length ? values[index] : ""} key={e}>
            {e}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
