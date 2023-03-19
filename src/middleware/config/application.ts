import { mongoDB } from "../../data-layer/adapters/mongo-db";
import { expressConfig } from "./express";

export const applicationConfig = async () => {
  const app = expressConfig();
  const port = process.env.PORT || 5001;

  await mongoDB();

  app.listen(port, async () => {
    console.log(`App listening on port ${port}`);
  });

  return app;
};
