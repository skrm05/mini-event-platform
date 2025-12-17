import express from "express";
import {
  createEvent,
  getAllEvents,
  deleteEvent,
  joinEvent,
  updateEvent,
  getUserDashboard,
} from "../controler/eventController.js";
import { verifyUser } from "../middleware/verifyUser.js";

const EventRouter = express.Router();
EventRouter.get("/dashboard", verifyUser, getUserDashboard);
EventRouter.get("/", getAllEvents);

EventRouter.post("/create", verifyUser, createEvent);

EventRouter.post("/:id/join", verifyUser, joinEvent);

EventRouter.delete("/:id", verifyUser, deleteEvent);

EventRouter.put("/:id", verifyUser, updateEvent);

export default EventRouter;
