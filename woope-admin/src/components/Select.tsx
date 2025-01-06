interface Props {
  options: string[];
  id?: string;
}

const Select = ({ options, id }: Props) => {
  return (
    <select className="form-select" aria-label="Default select example" id={id}>
      {options.map((e, index) => {
        return (
          <option value={index} key={e}>
            {e}
          </option>
        );
      })}
    </select>
  );
};

export default Select;
