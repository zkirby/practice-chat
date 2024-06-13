import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Chat from "@/pages/Chat";

import "./App.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Chat />
    </QueryClientProvider>
  );
}
