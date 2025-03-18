import React, { useState } from "react";

const Input = () => {
  const [selectedOption, setSelectedOption] = useState("Full Name");
  const options = ["Full Name", "Email", "User ID"];

  return (
    <>
      <div className="input-group mb-3">
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {selectedOption}
        </button>
        <ul className="dropdown-menu">
          {options.map((option) => {
            return (
              <li key={option}>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </a>
              </li>
            );
          })}
        </ul>
        <input
          type="text"
          className="form-control"
          aria-label="Text input with dropdown button"
        />
      </div>
    </>
  );
};

export default Input;
