import { useEffect, useState } from "react";
import { useUser } from "./authenticate.model";
import { URL } from "../../strings";

export default function Authenticate({ children }: React.PropsWithChildren) {
  const { user, set } = useUser((u) => ({ user: u.user, set: u.set }));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function auth() {
      setLoading(true);
      await fetch(`http://${URL}/auth`, { credentials: "include" });

      if (user) {
        setLoading(false);
        return;
      }
      const resp = await fetch(`http://${URL}/user`, {
        credentials: "include",
      });
      const { user: u } = await resp.json();
      set(u);
      setLoading(false);
    }

    auth();
  }, [user, set]);

  return loading ? <div className="spinner"></div> : children;
}
