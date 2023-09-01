import mongoose from "mongoose";

export async function startDatabase() {
  let connection = process.env.MONGO_URL;

  if(!connection)
    throw new Error("Env for mongo url not found")

  console.log("Connecting to database..");

  await mongoose.connect(connection, { keepAlive: true });

  console.log("Connected database");
}

