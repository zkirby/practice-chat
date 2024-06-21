import { Mongo } from "../infra/mongo";

export const threads = {
  list:
    ({ mongo }: { mongo: Mongo }) =>
    async (req, res) => {
      const { id, name } = req.currentUser;
      //   const { id: friendId } = req.body;

      const allMessages = await mongo.collection("messages");
      const messages = await allMessages.find({}).toArray();

      res.status(200).send({
        messages: messages.map((m) => ({
          id: m._id,
          userId: m.from,
          text: m.text,
          sentAt: m.sentAt,
          name,
        })),
      });
    },
  add:
    ({ mongo }: { mongo: Mongo }) =>
    async (req, res) => {
      const { id } = req.currentUser;
      const { id: friendId, text, sentAt } = req.body;

      await mongo
        .collection("messages")
        .insertOne({ from: id, to: friendId, text, sentAt });

      res.status(200).send({ success: true });
    },
};
