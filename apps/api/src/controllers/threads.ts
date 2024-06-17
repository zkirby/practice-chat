import { catchErrors } from "../errors";

export const friends = {
  list: catchErrors(async (_, res) => {
    res.status(200).send({ friends: [{ name: "bob" }, { name: "sally" }] });
  }),
};
