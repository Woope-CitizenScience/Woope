import React, { useState } from "react";

interface Role {
  role_id: number;
  name: string;
}

interface Props {
  items: Role[];
  onSelectItem: (item: Role | null) => void;
}

const RoleListGroup = ({ items, onSelectItem }: Props) => {
  const [selectedState, setSelectedState] = useState(-1);

  return (
    <div>
      {items.map((item, index) => (
        <ul className="list-group">
          <li
            className={
              index === selectedState
                ? "mb-2 list-group-item active"
                : "mb-2 list-group-item"
            }
            key={item.name}
            onClick={() => {
              setSelectedState(index);
              onSelectItem(item);
            }}
          >
            {item.name}
          </li>
        </ul>
      ))}
    </div>
  );
};

export default RoleListGroup;
