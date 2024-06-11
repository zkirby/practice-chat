import { color } from "../../display.utils";

import "./activeUsers.css";

export default function ActiveUsers({ ids }: { ids: string[] }) {
  return (
    <div className="active-users">
      {ids.map((id) => {
        const c = color(id);
        return (
          <span
            className="active-users__circle"
            style={{
              borderColor: c,
              color: c,
            }}
          >
            {id}
          </span>
        );
      })}
    </div>
  );
}
