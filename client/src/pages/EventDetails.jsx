import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get("/events");
        const foundEvent = data.find((e) => e._id === id);
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError("Event not found");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load event details.");
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleJoin = async () => {
    if (!user) {
      alert("Please login to join this event");
      navigate("/login");
      return;
    }
    setJoining(true);
    try {
      const { data } = await api.post(`/events/${id}/join`);
      setEvent(data.event);
      alert("Successfully joined the event!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join event");
    } finally {
      setJoining(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        alert("Event deleted successfully");
        navigate("/");
      } catch (err) {
        alert("Failed to delete event");
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error)
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  const creatorId = event?.createdBy?._id || event?.createdBy;
  const isOwner = user?.userId === creatorId;

  const isAttending = event?.attendees.some(
    (att) => (att._id || att) === user?.userId
  );

  const isFull = event?.attendees.length >= event?.capacity;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={event.image}
            alt={event.title}
            className="img-fluid rounded shadow-sm w-100"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>

        <div className="col-md-6 mt-4 mt-md-0">
          <h2 className="fw-bold mb-3">{event.title}</h2>
          <div className="mb-3">
            <span className="badge bg-primary me-2">{event.location}</span>
            <span className="badge bg-secondary">
              {new Date(event.date).toLocaleDateString()}
            </span>
          </div>
          <p className="lead text-muted">{event.description}</p>

          <div className="card bg-light border-0 p-3 mt-4">
            <div className="d-flex justify-content-between mb-2">
              <strong>Capacity:</strong>
              <span>{event.capacity} People</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <strong>Attending:</strong>
              <span>{event.attendees.length} Joined</span>
            </div>
            {isOwner ? (
              <div className="d-grid gap-2">
                <Link
                  to={`/edit-event/${event._id}`}
                  className="btn btn-warning"
                >
                  Edit Event
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete Event
                </button>
              </div>
            ) : isAttending ? (
              <button className="btn btn-success w-100" disabled>
                Already Joined
              </button>
            ) : isFull ? (
              <button className="btn btn-danger w-100" disabled>
                Event Full
              </button>
            ) : (
              <button
                className="btn btn-primary w-100"
                onClick={handleJoin}
                disabled={joining}
              >
                {joining ? "Joining..." : "Join Event"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
