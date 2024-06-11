import { useCallback, useEffect, useRef } from "react";
import withJsonParse from "./withJsonParse";

interface SSEProps {
  onMessage: (ev: string[]) => void;
}

/** Convenient interface for interacting with SSE */
export default function useSSE(
  stream: `http://${string}`,
  { onMessage }: SSEProps
) {
  const source = useRef<EventSource>();

  useEffect(() => {
    source.current = new EventSource(stream);
    return () => source.current?.close();
  }, [stream]);

  const wrappedOnMessage = useCallback(withJsonParse(onMessage), [onMessage]);

  useEffect(() => {
    if (!source.current) return;
    source.current.addEventListener("message", wrappedOnMessage);
    return () =>
      source.current?.removeEventListener("message", wrappedOnMessage);
  }, [wrappedOnMessage]);
}
