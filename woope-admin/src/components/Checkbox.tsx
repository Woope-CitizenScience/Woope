import React from "react";

interface Props {
  children?: string;
  id?: string;
  checked?: boolean;
}

const Checkbox = ({ children, id, checked = false }: Props) => {
  return (
    <>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={id}
        />
        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
          {children}
        </label>
      </div>
    </>
  );
};

export default Checkbox;
