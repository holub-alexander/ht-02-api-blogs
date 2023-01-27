import { mongoDB } from "../../data-layer/adapters/mongoDB";
import { expressConfig } from "./express";

export const applicationConfig = () => {
  const app = expressConfig();
  const port = process.env.PORT || 5000;

  app.listen(port, async () => {
    await mongoDB();
    console.log(`App listening on port ${port}`);
  });

  return app;
};
