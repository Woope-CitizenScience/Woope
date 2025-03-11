import { useState } from "react";

interface Props {
  items: string[];
  heading?: string;
  onSelectItem: (item: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: Props) {
  const [selectedState, setSelectedState] = useState(-1);

  return (
    <>
      <h1>{heading}</h1>
      {items.map((item, index) => (
        <ul className="list-group">
          <li
            className={
              index === selectedState
                ? "mb-2 list-group-item active"
                : "mb-2 list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedState(selectedState !== index ? index : -1);
              onSelectItem(selectedState !== index ? item : "");
            }}
          >
            {item}
          </li>
        </ul>
      ))}
    </>
  );
}

export default ListGroup;
