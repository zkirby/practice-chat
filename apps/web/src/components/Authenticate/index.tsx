import { useEffect, useState } from "react";
import { useUser } from "./authenticate.model";

export default function Authenticate({ children }: React.PropsWithChildren) {
  const { user, set } = useUser((u) => ({ user: u.user, set: u.set }));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      return;
    }

    async function auth() {
      setLoading(true);
      await fetch("/auth");
      const resp = await fetch("/user");
      const { user } = await resp.json();
      set(user);
      setLoading(false);
    }

    auth();
  }, []);

  return loading ? <div className="spinner"></div> : children;
}
