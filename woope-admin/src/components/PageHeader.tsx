import { Children } from "react";
import React from "react";

interface Props {
  children: string;
}

const PageHeader = ({ children }: Props) => {
  return <h1 className="pb-4">{children}</h1>;
};

export default PageHeader;
