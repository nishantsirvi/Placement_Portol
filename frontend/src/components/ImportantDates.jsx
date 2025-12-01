import React, { useState, useEffect } from "react";
import {
    getImportantDates,
    createImportantDate,
    updateImportantDate,
    deleteImportantDate,
    getCompanies,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import Calendar from "./Calendar";

const ImportantDates = () => {
    const { isAdmin } = useAuth();
    const [dates, setDates] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingDate, setEditingDate] = useState(null);
    const [viewMode, setViewMode] = useState("list"); // 'list' or 'calendar'
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        event_type: "DRIVE",
        company: "",
        event_date: "",
        location: "",
        link: "",
        is_active: true,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [datesRes, companiesRes] = await Promise.all([
                getImportantDates(),
                getCompanies(),
            ]);

            setDates(datesRes.data.results || datesRes.data);
            setCompanies(companiesRes.data.results || companiesRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                company: formData.company || null,
            };

            if (editingDate) {
                await updateImportantDate(editingDate.id, dataToSend);
            } else {
                await createImportantDate(dataToSend);
            }
            fetchData();
            resetForm();
        } catch (error) {
            console.error("Error saving date:", error);
            alert("Error saving important date. Please check all fields.");
        }
    };

    const handleEdit = (date) => {
        setEditingDate(date);
        // Format datetime for input field (datetime-local expects YYYY-MM-DDTHH:MM format)
        const eventDate = new Date(date.event_date);
        const formattedDate = eventDate.toISOString().slice(0, 16);

        setFormData({
            title: date.title,
            description: date.description,
            event_type: date.event_type,
            company: date.company || "",
            event_date: formattedDate,
            location: date.location,
            link: date.link || "",
            is_active: date.is_active,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (
            window.confirm(
                "Are you sure you want to delete this important date?",
            )
        ) {
            try {
                await deleteImportantDate(id);
                fetchData();
            } catch (error) {
                console.error("Error deleting date:", error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            event_type: "DRIVE",
            company: "",
            event_date: "",
            location: "",
            link: "",
            is_active: true,
        });
        setEditingDate(null);
        setShowForm(false);
    };

    const getEventTypeColor = (type) => {
        const colors = {
            DRIVE: "event-drive",
            DEADLINE: "event-deadline",
            TEST: "event-test",
            INTERVIEW: "event-interview",
            RESULT: "event-result",
            OTHER: "event-other",
        };
        return colors[type] || "event-other";
    };

    const isUpcoming = (eventDate) => {
        return new Date(eventDate) > new Date();
    };

    if (loading) {
        return <div className="loading">Loading important dates...</div>;
    }

    const handleEventClick = (event) => {
        setSelectedEvent(event);
    };

    return (
        <div className="important-dates-container">
            <div className="header">
                <h1>Important Dates & Events</h1>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {/* View Toggle */}
                    <div style={{
                        display: 'flex',
                        background: '#f3f4f6',
                        borderRadius: '8px',
                        padding: '4px'
                    }}>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                padding: '0.5rem 1rem',
                                border: 'none',
                                background: viewMode === 'list' ? '#667eea' : 'transparent',
                                color: viewMode === 'list' ? 'white' : '#374151',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            📋 List
                        </button>
                        <button
                            onClick={() => setViewMode('calendar')}
                            style={{
                                padding: '0.5rem 1rem',
                                border: 'none',
                                background: viewMode === 'calendar' ? '#667eea' : 'transparent',
                                color: viewMode === 'calendar' ? 'white' : '#374151',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            📅 Calendar
                        </button>
                    </div>
                    {isAdmin && (
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? "Cancel" : "+ Add Event"}
                        </button>
                    )}
                </div>
            </div>

            {isAdmin && showForm && (
                <div className="form-container">
                    <h2>{editingDate ? "Edit Event" : "Add New Event"}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Title*</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Event Type*</label>
                                <select
                                    name="event_type"
                                    value={formData.event_type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="DRIVE">
                                        Placement Drive
                                    </option>
                                    <option value="DEADLINE">
                                        Application Deadline
                                    </option>
                                    <option value="TEST">
                                        Test/Assessment
                                    </option>
                                    <option value="INTERVIEW">Interview</option>
                                    <option value="RESULT">
                                        Result Announcement
                                    </option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Company</label>
                                <select
                                    name="company"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                >
                                    <option value="">
                                        Select Company (Optional)
                                    </option>
                                    {companies.map((company) => (
                                        <option
                                            key={company.id}
                                            value={company.id}
                                        >
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Event Date & Time*</label>
                                <input
                                    type="datetime-local"
                                    name="event_date"
                                    value={formData.event_date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Location*</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Main Auditorium, Online"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Link (Optional)</label>
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    placeholder="e.g., https://example.com/event"
                                />
                            </div>
                            <div className="form-group full-width">
                                <label>Description*</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                    />
                                    Is Active
                                </label>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingDate ? "Update" : "Create"} Event
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' ? (
                <div>
                    <Calendar events={dates} onEventClick={handleEventClick} />
                    
                    {/* Event Details Modal */}
                    {selectedEvent && (
                        <div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.5)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1000
                            }}
                            onClick={() => setSelectedEvent(null)}
                        >
                            <div
                                style={{
                                    background: 'white',
                                    borderRadius: '12px',
                                    padding: '2rem',
                                    maxWidth: '500px',
                                    width: '90%',
                                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h2 style={{ margin: 0 }}>{selectedEvent.title}</h2>
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '1.5rem',
                                            cursor: 'pointer',
                                            color: '#6b7280'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <span className="badge badge-primary">{selectedEvent.event_type_display}</span>
                                    {selectedEvent.is_active && <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>Active</span>}
                                </div>
                                <div style={{ color: '#374151', lineHeight: '1.6' }}>
                                    <p><strong>📅 Date:</strong> {new Date(selectedEvent.event_date).toLocaleString()}</p>
                                    <p><strong>📍 Location:</strong> {selectedEvent.location}</p>
                                    {selectedEvent.company_name && <p><strong>🏢 Company:</strong> {selectedEvent.company_name}</p>}
                                    {selectedEvent.link && (
                                        <p><strong>🔗 Link:</strong>{' '}
                                            <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                                {selectedEvent.link}
                                            </a>
                                        </p>
                                    )}
                                    <p style={{ marginTop: '1rem' }}>{selectedEvent.description}</p>
                                </div>
                                {isAdmin && (
                                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-sm btn-info" onClick={() => {
                                            handleEdit(selectedEvent);
                                            setSelectedEvent(null);
                                        }}>
                                            Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => {
                                            handleDelete(selectedEvent.id);
                                            setSelectedEvent(null);
                                        }}>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                /* List View */
                <div className="dates-timeline">
                {dates.map((date) => (
                    <div
                        key={date.id}
                        className={`date-card ${getEventTypeColor(date.event_type)} ${isUpcoming(date.event_date) ? "upcoming" : "past"}`}
                    >
                        <div className="date-header">
                            <div>
                                <h3>{date.title}</h3>
                                <span className="event-type-badge">
                                    {date.event_type_display}
                                </span>
                                {isUpcoming(date.event_date) && (
                                    <span className="upcoming-badge">
                                        Upcoming
                                    </span>
                                )}
                            </div>
                            <span
                                className={`badge ${date.is_active ? "badge-success" : "badge-secondary"}`}
                            >
                                {date.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <div className="date-details">
                            <p>
                                <strong>📅 Date:</strong>{" "}
                                {new Date(date.event_date).toLocaleString()}
                            </p>
                            <p>
                                <strong>📍 Location:</strong> {date.location}
                            </p>
                            {date.company_name && (
                                <p>
                                    <strong>🏢 Company:</strong>{" "}
                                    {date.company_name}
                                </p>
                            )}
                            {date.link && (
                                <p>
                                    <strong>🔗 Link:</strong>{" "}
                                    <a href={date.link} target="_blank" rel="noopener noreferrer" style={{color: "#667eea", textDecoration: "underline"}}>
                                        {date.link}
                                    </a>
                                </p>
                            )}
                            <p className="description">{date.description}</p>
                        </div>
                        {isAdmin && (
                            <div className="date-actions">
                                <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => handleEdit(date)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(date.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                </div>
            )}
        </div>
    );
};

export default ImportantDates;
