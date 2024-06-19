import { useQuery } from "@tanstack/react-query";
import "./Threads.css";
import { URL } from "../../strings";

export default function Threads() {
  const query = useQuery({
    queryKey: ["/friends"],
    queryFn: () =>
      fetch(`http://${URL}/friends`, { credentials: "include" }).then((res) =>
        res.json()
      ),
  });

  return (
    <div className="threads__wrapper">
      <div className="threads__header">
        <div className="threads__header__top">
          <h1>Chat</h1>
          <button type="button">+</button>
        </div>
        <input type="text" placeholder="search..." />
      </div>

      <div className="threads__messages">
        {query.isLoading ? (
          <div className="spinner"></div>
        ) : (
          <>
            {query.data.friends.map((f: { name: string }) => {
              return <div className="threads__thread">{f.name}</div>;
            })}
          </>
        )}
      </div>
    </div>
  );
}
