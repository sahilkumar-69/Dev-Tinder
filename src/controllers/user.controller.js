import { isValidObjectId } from "mongoose";
import ConnectionRequest from "../models/connectionRequest.model.js";
import UserModel from "../models/user.model.js";

const POPULATE_FIELDS = [
  "firstName",
  "lastName",
  "photoUrl",
  "skills",
  "about",
];

const userRequestsReceived = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const requests = await ConnectionRequest.find({
      receiver: userId,
      status: "interested",
    });

    return res.status(200).json({
      data: requests,
      success: true,
      message: "Requests fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: error.message,
    });
  }
};

const userConnections = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        {
          sender: userId,
          status: "accepted",
        },
        {
          receiver: userId,
          status: "accepted",
        },
      ],
    })
      .select("sender receiver")
      .populate("sender", POPULATE_FIELDS)
      .populate("receiver", POPULATE_FIELDS);

    return res.status(200).json({
      data: connections,
      success: true,
      message: "Connections fetched",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: error.message,
    });
  }
};

const sendConnectionRequest = async (req, res) => {
  try {
    const { status, userId } = req.params;

    const valide_status = ["ignored", "interested"];

    if (!status || !valide_status.includes(status)) {
      throw new Error("Invalid status");
    }

    if (!userId || !isValidObjectId(userId)) {
      throw new Error("Invalid user id");
    }

    if (userId.toString() === req.user._id.toString()) {
      throw new Error("You can't send a request to yourself");
    }

    const user = await UserModel.findById(userId);
    // console.log(user);

    if (!user) {
      throw new Error("Invalide userId");
    }

    const isAlreadySent = await ConnectionRequest.findOne({
      $or: [
        {
          sender: req.user._id,
          receiver: userId,
        },
      ],
    });

    if (isAlreadySent) {
      throw new Error("Request already sent");
    }

    const request = await ConnectionRequest.create({
      sender: req.user._id,
      receiver: userId,
      status,
    });

    return res.status(200).json({
      data: request,
      success: true,
      message: "Request sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: error.message,
    });
  }
};

const reviewConnectionRequest = async (req, res) => {
  try {
    const { status, requestId } = req.params;

    const valide_status = ["accepted", "rejected"];

    if (!status || !valide_status.includes(status)) {
      throw new Error("Invalid status");
    }

    if (!requestId || !isValidObjectId(requestId)) {
      throw new Error("Invalid request id");
    }

    const request = await ConnectionRequest.findById(requestId);

    if (!request || request.status !== "interested") {
      throw new Error("Invalide requestId or request is not interested");
    }

    request.status = status;
    await request.save();

    return res.status(200).json({
      data: request,
      success: true,
      message: "Request reviewed to " + status,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: error.message, success: false });
  }
};

export {
  userRequestsReceived,
  userConnections,
  sendConnectionRequest,
  reviewConnectionRequest,
};
