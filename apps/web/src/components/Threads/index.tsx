import { useQuery } from "@tanstack/react-query";
import "./Threads.css";
import { URL } from "../../strings";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Modal from "../Modal";

export default function Threads({ ids }: { ids: string[] }) {
  const friendsQuery = useQuery({
    queryKey: ["/friends"],
    queryFn: () =>
      fetch(`http://${URL}/friends`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((res) => res.json()),
  });
  const friendsMutation = useMutation({
    mutationFn: (id) =>
      fetch(`http://${URL}/friends`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id }),
      }).then(() => friendsQuery.refetch()),
  });
  const usersQuery = useQuery({
    queryKey: ["/users"],
    queryFn: () =>
      fetch(`http://${URL}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then((res) => res.json()),
  });

  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = friendsQuery.data?.friends?.filter((f) =>
    f.name.startsWith(term)
  );

  return (
    <div className="threads__wrapper">
      <div className="threads__header">
        <div className="threads__header__top">
          <h1>Chat</h1>
          <button type="button" onClick={() => setOpen(true)}>
            +
          </button>
        </div>
        <input
          type="text"
          placeholder="search..."
          value={term}
          onChange={(e) => setTerm(e.currentTarget.value)}
        />
      </div>

      <Modal open={open}>
        <>
          {usersQuery.isLoading ? (
            <div className="spinner"></div>
          ) : (
            <div>
              {usersQuery.data.users.map((u) => {
                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      friendsMutation.mutate(u.id);
                      setOpen(false);
                    }}
                  >
                    {u.name}
                  </div>
                );
              })}
            </div>
          )}
        </>
      </Modal>

      <div className="threads__messages">
        {friendsQuery.isLoading ? (
          <div className="spinner"></div>
        ) : (
          <>
            {filtered?.map((f: { name: string; id: string }) => {
              return (
                <div
                  key={f.id}
                  className={`threads__thread ${
                    ids.includes(`${f.id}`) ? "active" : ""
                  }`}
                >
                  {f.name}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
