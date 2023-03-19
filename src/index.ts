import { mongoDB } from "./data-layer/adapters/mongo-db";
import { expressConfig } from "./middleware/config/express";

const startApp = async () => {
  const app = expressConfig();
  const port = process.env.PORT || 5001;

  await mongoDB();

  app.listen(port, async () => {
    console.log(`App listening on port ${port}`);
  });
};

startApp().then(() => console.log("Connected"));
