import { Timestamp } from "mongodb";
import { Schema, model } from "mongoose";
const connectionRequestSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  receiver: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["ignored", "accepted", "rejected", "interested"],
      message: `invalid status `,
    },
  },
});

const ConnectionRequest = model("ConnectionRequest", connectionRequestSchema);
export default ConnectionRequest;
