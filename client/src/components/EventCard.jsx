import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <div className="card h-100 shadow-sm">
      <img
        src={event.image}
        className="card-img-top"
        alt={event.title}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{event.title}</h5>

        <p className="text-muted small mb-2">
          {new Date(event.date).toLocaleDateString()}
        </p>

        <p className="card-text text-truncate">{event.description}</p>

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge bg-light text-dark border">
              {event.location}
            </span>
            <small className="text-muted">
              {event.attendees.length} / {event.capacity} Joined
            </small>
          </div>

          <Link
            to={`/event/${event._id}`}
            className="btn btn-outline-primary w-100"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
