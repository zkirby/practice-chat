import { useEffect, useState } from "react";
import { useUser } from "./authenticate.model";
import { URL } from "@/strings";
import { useMutation, useQuery } from "@tanstack/react-query";

import "./authenticate.css";

export default function Authenticate({ children }: React.PropsWithChildren) {
  const { set } = useUser((u) => ({ user: u.user, set: u.set }));

  const userQuery = useQuery({
    retry: false,
    queryKey: ["/me"],
    queryFn: () =>
      fetch(`http://${URL}/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((r) => r.json()),
  });
  const userMutation = useMutation({
    mutationFn: (user: { username: string; password: string }) =>
      fetch(`http://${URL}/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
      }).then(async (r) => {
        const { token } = await r.json();
        localStorage.setItem("token", token);
        userQuery.refetch();
      }),
  });

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function auth() {
      if (userQuery.isSuccess) {
        const { user } = userQuery.data as any;
        set(user);
        setLoggedIn(true);
      }
    }
    auth();
  }, [userQuery.isSuccess]);

  const loading = userQuery.isPending || userMutation.isPending;

  if (!loading && loggedIn) {
    return children;
  }
  return (
    <div className="auth-screen">
      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="login-screen">
          <h2>Sign In</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              userMutation.mutate({
                username: form.get("username") as string,
                password: form.get("password") as string,
              });
            }}
          >
            <input name="username" placeholder="username" type="text" />
            <input name="password" placeholder="password" type="password" />
            <button>Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}
