import { Database } from "../infra/database";

export const friends = {
  list:
    ({ db }: { db: Database }) =>
    async (req, res) => {
      const { id } = req.currentUser;
      const friends = await db.query(`
          SELECT u1.id AS user_id, u1.name AS user_name,
          u2.id AS friend_id, u2.name AS friend_name
          FROM friends f
          JOIN users u1 ON f.user1 = u1.id
          JOIN users u2 ON f.user2 = u2.id
          WHERE u1.id = '${id}' OR u2.id = '${id}';
        `);
      res.status(200).send({
        friends: friends.rows.map((f) => {
          if (f.user_id === id) {
            return {
              id: f.friend_id,
              name: f.friend_name,
            };
          }
          return {
            id: f.user_id,
            name: f.user_name,
          };
        }),
      });
    },
  add:
    ({ db }: { db: Database }) =>
    async (req, res) => {
      const { id } = req.currentUser;
      const { id: friendId } = req.body;
      console.log(id, friendId);
      await db.query(
        `INSERT INTO friends (user1, user2) VALUES ('${id}', '${friendId}')`
      );
      res.status(200).send({ success: true });
    },
};
