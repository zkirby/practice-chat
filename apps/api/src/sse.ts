import { Express } from "express";

let _clients: any[] = [];

export const attachSSE = (app: Express) => {
  app.get("/streaming", (req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders(); // flush the headers to establish SSE with client

    const id = req.query.id;
    if (!_clients.includes((p: any) => p.id === id)) {
      _clients.push({ res, id });
      _clients.forEach(({ res }) => {
        res.write(`data: ${JSON.stringify(_clients.map((s) => s.id))}\n\n`);
      });
    }

    // If client closes connection, stop sending events
    res.on("close", () => {
      console.log("client dropped me");
      _clients = _clients.filter((p) => p.id !== id);
      _clients.forEach(({ res }) => {
        res.write(`data: ${JSON.stringify(_clients.map((s) => s.id))}\n\n`);
      });
      res.end();
    });
  });
};
