/** Middleware to JSON parse message-based APIs like SSE and ws */
const withJsonParse =
  <T extends (a: Parameters<T>[0]) => void>(cb: T) =>
  (payload: MessageEvent<string>): void =>
    cb(JSON.parse(payload.data));

export default withJsonParse;
