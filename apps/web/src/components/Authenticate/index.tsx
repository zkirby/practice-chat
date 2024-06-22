import { useEffect, useState } from "react";
import { useUser } from "./authenticate.model";
import { URL } from "@/strings";
import { useMutation } from "@tanstack/react-query";

import "./authenticate.css";

export default function Authenticate({ children }: React.PropsWithChildren) {
  const userMutation = useMutation({
    mutationFn: (user: { username: string; password: string }) =>
      fetch(`http://${URL}/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: user.username,
          password: user.password,
        }),
      }),
  });

  const { set } = useUser((u) => ({ user: u.user, set: u.set }));

  const [authLoading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    async function auth() {
      setLoading(true);
      try {
        const resp = await fetch(`http://${URL}/me`, {
          credentials: "include",
        });
        const { user } = await resp.json();
        set(user);
        setLoggedIn(true);
      } catch {
        setLoggedIn(false);
      }
      setLoading(false);
    }

    auth();
  }, []);

  const loading = authLoading || userMutation.isPending;

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
