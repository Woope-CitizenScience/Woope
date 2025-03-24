import React, { useState } from "react";

interface Props {
  children?: string;
  id?: string;
  checked?: boolean;
}

const Checkbox = ({ children, id, checked = false }: Props) => {
  const [isChecked, setIsChecked] = useState(checked);
  return (
    <>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={id}
          checked={isChecked}
          onChange={() => {
            setIsChecked(!isChecked);
          }}
        />
        <label className="form-check-label" htmlFor={id}>
          {children}
        </label>
      </div>
    </>
  );
};

export default Checkbox;
