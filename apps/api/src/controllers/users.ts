import { Database } from "../infra/database";

export const users = {
  list:
    ({ db }: { db: Database }) =>
    async (req, res) => {
      const { id } = req.currentUser;
      const users = await db.query(
        `SELECT id,name FROM users WHERE id != '${id}'`
      );
      res.status(200).send({ users: users.rows });
    },
};
