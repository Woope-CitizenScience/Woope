import { useState } from "react";

interface Props {
  items: string[];
  heading: string;
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
                ? "list-group-item active"
                : "list-group-item"
            }
            key={item}
            onClick={() => {
              setSelectedState(index);
              onSelectItem(item);
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
