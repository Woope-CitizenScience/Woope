import React from "react";

interface Props {
  children: string;
  className?: string;
  color?: "primary" | "secondary" | "danger";
  onClick?: () => void;
}

const Button = ({ children, className, color = "primary", onClick }: Props) => {
  const buttonColor = "btn btn-" + color;
  return (
    <>
      <button
        type="button"
        className={buttonColor + " " + className}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
