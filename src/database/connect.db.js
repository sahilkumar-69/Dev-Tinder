import { connect } from "mongoose";
import "dotenv/config";
const ConnectDB = async () => {
  await connect(process.env.MONGO_URL);
  console.log("Database connected");
};

export default ConnectDB;
