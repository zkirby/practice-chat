import express from "express";
import cors from "cors";

const port = process.env.PORT || 5001;
const app = express();

app.use(cors());

app.get("/healthz", (req: any, res: any) => {
  return res.json({ message: `hello ${req.params.name}` });
});

app.listen(port, () => {
  console.log(`api running on ${port}`);
});
