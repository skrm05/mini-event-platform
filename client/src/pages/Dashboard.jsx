import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import EventCard from "../components/EventCard";

const Dashboard = () => {
  const [createdEvents, setCreatedEvents] = useState([]);
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/events/dashboard");
        setCreatedEvents(data.createdEvents);
        setJoinedEvents(data.joinedEvents);
        setLoading(false);
      } catch (err) {
        setError("Failed to load dashboard.");
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return <div className="alert alert-danger text-center mt-5">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">My Dashboard</h2>

      <div className="mb-5">
        <h4 className="border-bottom pb-2 mb-3 text-primary">
          Events I Created
        </h4>
        <div className="row">
          {createdEvents.length === 0 ? (
            <p className="text-muted">You haven't created any events yet.</p>
          ) : (
            createdEvents.map((event) => (
              <div className="col-lg-6 mb-4" key={event._id}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">{event.title}</h5>
                    <span className="badge bg-secondary">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-3">
                      <small className="text-muted">
                        <strong>Location:</strong> {event.location}
                      </small>
                      <small className="text-muted">
                        <strong>Capacity:</strong> {event.attendees.length} /{" "}
                        {event.capacity}
                      </small>
                    </div>

                    <h6 className="fw-bold border-bottom pb-2">
                      Attendee List
                    </h6>
                    {event.attendees.length === 0 ? (
                      <p className="text-muted small">No one has joined yet.</p>
                    ) : (
                      <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                        <ul className="list-group list-group-flush">
                          {event.attendees.map((attendee) => (
                            <li
                              key={attendee._id}
                              className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center"
                            >
                              <span className="fw-semibold">
                                {attendee.name}
                              </span>
                              <span className="text-muted small">
                                {attendee.email}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="card-footer bg-white">
                    <Link
                      to={`/event/${event._id}`}
                      className="btn btn-outline-primary btn-sm w-100"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h4 className="border-bottom pb-2 mb-3 text-success">
          Events I Joined
        </h4>
        <div className="row">
          {joinedEvents.length === 0 ? (
            <p className="text-muted">You haven't joined any events yet.</p>
          ) : (
            joinedEvents.map((event) => (
              <div className="col-md-4 mb-4" key={event._id}>
                <EventCard event={event} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
