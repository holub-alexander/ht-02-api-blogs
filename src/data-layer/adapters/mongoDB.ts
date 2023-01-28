import { MongoClient } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.c1xap4q.mongodb.net/${process.env.MONGODB_DATABASE_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const db = client.db(process.env.MONGODB_DATABASE_NAME);

/**
 * Collections
 */

export const blogsCollection = db.collection("blogs");
export const postsCollection = db.collection("posts");
export const usersCollection = db.collection("users");

export const mongoDB = async () => {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to MongoDB server");
  } catch (err) {
    await client.close();
    console.log(err);
  }
};
