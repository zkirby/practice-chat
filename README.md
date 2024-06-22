### TODO:

- [ ] Deploy to AWS cloud (possibly test on ngix as well)
  - load balancer
  - ec2 auto scale
  - Postgres RDS db
  - also review everything that I'm supposed to know in theory lol.

If time:

- [ ] Add per-friend threading
- [ ] Add offline support + optimistic updates

**_ CLEAN UP AND STOP WORKING ON IT - move to the next thing _**

### Resources

- https://ably.com/blog/websockets-vs-http-streaming-vs-sse
- https://www.linkedin.com/blog/engineering/archive/instant-messaging-at-linkedin-scaling-to-hundreds-of-thousands-#:~:text=Server%2Dsent%20events%20(SSE),client%20to%20make%20subsequent%20requests.
- https://ably.com/blog/chat-app-architecture
- https://ably.com/blog/what-it-takes-to-build-a-realtime-chat-or-messaging-app

- https://ably.com/topic/server-sent-events
- https://ably.com/topic/the-challenge-of-scaling-websockets
- https://ably.com/topic/websocket-security

- https://ably.com/blog/websockets-react-tutorial

* SSE for online notifs =>

[Should you use SSE for chat](https://ably.com/topic/server-sent-events):
"Long story short, we do not recommend that you use SSE for your chat experience.

This could be a little bit surprising since, earlier in this post, we referenced a retrospective by LinkedIn where the team describes adapting SSE for chat. It’s worth pointing out that, in the same post, they say:
"
“WebSockets is a much more powerful technology to perform bi-directional, full-duplex communication, and we will be upgrading to that as the protocol of choice when possible.”

--
https://ably.com/topic/the-challenge-of-scaling-websockets#web-socket-fallback-strategy

"There’s a moderate overhead in establishing a new WebSocket connection — the process involves a non-trivial request/response pair between the client and the server, known as the opening handshake. Imagine tens of thousands or millions of client devices trying to open WebSocket connections simultaneously. Such a scenario leads to a massive burst in traffic"

"You must consider a backoff mechanism to prevent rejected clients from attempting to reconnect immediately; this would just put your system under more pressure."

"You might also consider dropping existing connections to reduce the load on your system; for example, the idle ones (which, even though idle, are still consuming resources due to heartbeats). "

Best strategy for reconnect is exponential backoff w/ jitter

If you examine the ratio of Ping/Pong frames to actual messages sent over WebSockets, you might send more heartbeats than messages. If your use case allows, reduce the frequency of heartbeats to make it easier to scale

Backpressure is one of the critical issues you will have to deal with when streaming data to client devices at scale over the internet. For example, let’s assume you are streaming 20 messages per second, but a client can only handle 15 messages per second. What do you do with the remaining five messages per second that the client cannot consume?

You need to manage buffers to ensure that the client is not overwhelmed and doesn't drop messages.

To reduce backpressure you can drop packets indiscriminately and do message compression
