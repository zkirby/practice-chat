import { useCallback, useEffect, useRef } from "react";
import useUserId from "./useUserId";

enum ReadyState {
  UNINSTANTIATED = -1,
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

type WebsocketMessage = string | ArrayBufferLike | Blob | ArrayBufferView;

declare const __brand: unique symbol;
type Brand<B> = { readonly [__brand]: B };
type Id<B> = string & Brand<B>;

type UserId = Id<"UserId">;
type ContentId = Id<"ContentId">;

type FragmentPayload = {
  /** id of the message that this fragment belongs to */
  id: string;
  /** A fragment if this message just contains a fragment */
  fragment: string;
};
type FullTextPayload = {
  /** id of the message*/
  id: UserId;
  /** the entire message text if this ws contains this text */
  text: string;
};

export type MessagePayload = {
  user: {
    /** id of the user that sent this message  */
    id: ContentId;
    /** role of the user that sent this message */
    role: "ai" | "human";
  };
  content: FragmentPayload | FullTextPayload;
  /** ISO DateTime that the *message* was sent at */
  sentAt: string;
};

/**
 * Used to send and receive messages from a websocket server.
 *
 * @returns `send` function used to send a message to the server
 */
export default function useWebsocket(
  path: `ws://${string}`,
  {
    onMessage,
    onOpen,
  }: {
    onMessage: (ev: MessagePayload) => void;
    onOpen?: () => void;
  }
): [WebSocket["send"]] {
  const ws = useRef<WebSocket>();
  const id = useUserId();

  useEffect(() => {
    ws.current = new WebSocket(path);
    return () => ws.current?.close();
  }, [path]);

  const wrappedOnMessage = useCallback(withJsonParse(onMessage), [onMessage]);

  useEffect(() => {
    if (!ws.current) return;

    if (onOpen) {
      ws.current.removeEventListener("open", onOpen);
      ws.current.addEventListener("open", onOpen);
    }
    ws.current.removeEventListener("message", wrappedOnMessage);
    ws.current.addEventListener("message", wrappedOnMessage);
    return () => {
      onOpen && ws.current?.addEventListener("open", onOpen);
      ws.current?.removeEventListener("message", wrappedOnMessage);
    };
  }, [onOpen, wrappedOnMessage]);

  const send = useCallback((message: WebsocketMessage) => {
    const w = ws.current;
    if (!w) return;
    if (w?.readyState === ReadyState.OPEN)
      w.send(JSON.stringify({ id, message }));
  }, []);

  return [send];
}

/** Middleware to JSON parse contents before passing on */
const withJsonParse =
  <T extends (a: MessagePayload) => void>(cb: T) =>
  (payload: MessageEvent<string>): void =>
    cb(JSON.parse(payload.data));
