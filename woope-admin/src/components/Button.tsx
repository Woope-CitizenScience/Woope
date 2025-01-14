import React from "react";

interface Props {
  children: string;
  color?: "primary" | "secondary" | "danger";
  onClick: () => void;
}

const Button = ({ children, color = "primary", onClick }: Props) => {
  const buttonColor = "btn btn-" + color;
  return (
    <>
      <button type="button" className={buttonColor} onClick={onClick}>
        {children}
      </button>
    </>
  );
};

export default Button;
