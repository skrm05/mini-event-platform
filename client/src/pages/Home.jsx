import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import EventCard from "../components/EventCard";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get("/events");
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load events.");
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Upcoming Events</h2>
        {localStorage.getItem("token") && (
          <Link to="/create-event" className="btn btn-primary">
            + Create Event
          </Link>
        )}
      </div>

      <div className="row">
        {events.length === 0 ? (
          <div className="col-12 text-center">
            <p className="text-muted">No events found.</p>
          </div>
        ) : (
          events.map((event) => (
            <div className="col-md-4 mb-4" key={event._id}>
              <EventCard event={event} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
