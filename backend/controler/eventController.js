import Event from "../model/eventModel.js";

export const createEvent = async (req, res) => {
  //console.log(req.body);
  if (!req.body) {
    return res
      .status(400)
      .json({ status: false, message: "Provide event information" });
  }
  try {
    const { title, description, date, location, capacity, image } = req.body;

    if (!title || !date || !location || !capacity || !image) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      capacity,
      image,
      createdBy: req.id,
      attendees: [],
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Create Event Error:", error.message);
    res.status(500).json({ message: "Failed to create event." });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ date: 1 })
      .populate("createdBy", "name email")
      .populate("attendees", "name");

    res.status(200).json(events);
  } catch (error) {
    console.error("Get Events Error:", error);
    res.status(500).json({ message: "Failed to fetch events." });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (event.createdBy.toString() !== req.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this event." });
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ message: "Failed to delete event." });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, capacity, image } = req.body;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (event.createdBy.toString() !== req.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this event." });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.capacity = capacity || event.capacity;
    event.image = image || event.image;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ message: "Failed to update event." });
  }
};

export const joinEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.id;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: "You have already joinEvent." });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: id,
        attendees: { $ne: userId },
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] },
      },
      {
        $push: { attendees: userId },
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res
        .status(400)
        .json({ message: "Event is full or request failed." });
    }

    res
      .status(200)
      .json({ message: "joinEvent successful!", event: updatedEvent });
  } catch (error) {
    console.error("joinEvent Error:", error);
    res.status(500).json({ message: "Server error during joinEvent" });
  }
};

export const getUserDashboard = async (req, res) => {
  try {
    const createdEvents = await Event.find({ createdBy: req.id }).populate(
      "attendees",
      "name email"
    );
    const joinedEvents = await Event.find({ attendees: req.id }).populate(
      "createdBy",
      "name"
    );

    res.status(200).json({ createdEvents, joinedEvents });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard data." });
  }
};
