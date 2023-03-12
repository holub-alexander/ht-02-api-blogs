import { mongoDB } from "../../data-layer/adapters/mongo-db";
import { expressConfig } from "./express";

export const applicationConfig = () => {
  const app = expressConfig();
  const port = process.env.PORT || 5001;

  app.listen(port, async () => {
    await mongoDB();
    console.log(`App listening on port ${port}`);
  });

  return app;
};
