import React, { useState, useEffect } from 'react';
import { getPlacementStatistics, getPlacementProgress, getCompanies, getImportantDates } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Statistics from './Statistics';

const Dashboard = () => {
  const { user, isStudent } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myPlacements, setMyPlacements] = useState([]);
  const [eligibleCompanies, setEligibleCompanies] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStudent]);

  const fetchDashboardData = async () => {
    try {
      if (isStudent) {
        // Fetch student-specific data
        const [placementsRes, companiesRes, eventsRes] = await Promise.all([
          getPlacementProgress(),
          getCompanies(),
          getImportantDates()
        ]);
        
        setMyPlacements(placementsRes.data.results || placementsRes.data || []);
        setEligibleCompanies((companiesRes.data.results || companiesRes.data || [])
          .filter(c => c.is_active)
          .slice(0, 6)); // Show top 6
        setUpcomingEvents((eventsRes.data.results || eventsRes.data || [])
          .filter(e => new Date(e.event_date) > new Date() && e.is_active)
          .slice(0, 5)); // Show next 5
      } else {
        // Fetch admin/company statistics
        const response = await getPlacementStatistics();
        setStats(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  // Student Dashboard
  if (isStudent) {
    const appliedCount = myPlacements.length;
    const selectedCount = myPlacements.filter(p => p.status === 'SELECTED' || p.status === 'OFFER_ACCEPTED').length;
    const pendingCount = myPlacements.filter(p => p.status === 'APPLIED' || p.status === 'IN_PROGRESS').length;

    return (
      <div className="dashboard">
        <h1>Welcome, {user?.first_name || user?.username}</h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Track your placement journey</p>

        {/* Quick Stats - Only cards for KPIs */}
        <div className="kpi-stats">
          <div className="kpi-card">
            <div className="kpi-label">Applications</div>
            <div className="kpi-value">{appliedCount}</div>
          </div>
          <div className="kpi-card kpi-success">
            <div className="kpi-label">Selected</div>
            <div className="kpi-value">{selectedCount}</div>
          </div>
          <div className="kpi-card kpi-pending">
            <div className="kpi-label">Pending</div>
            <div className="kpi-value">{pendingCount}</div>
          </div>
        </div>

        <div className="dashboard-sections">
          {/* My Application Status - Flat section */}
          <div className="section-panel">
            <h2 className="section-title">My Applications</h2>
            {myPlacements.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p>No applications yet. Check out the companies below.</p>
              </div>
            ) : (
              <div className="list-rows">
                {myPlacements.map((placement, idx) => (
                  <div key={idx} className="list-row">
                    <div>
                      <div className="list-title">{placement.company_name}</div>
                      <div className="list-meta">{placement.current_stage_name || 'Applied'}</div>
                    </div>
                    <span className={`badge badge-${
                      placement.status === 'OFFER_ACCEPTED' || placement.status === 'SELECTED' ? 'success' :
                      placement.status === 'REJECTED' ? 'danger' :
                      placement.status === 'IN_PROGRESS' ? 'warning' : 'info'
                    }`}>
                      {placement.status_display}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Eligible Companies - Flat section */}
          <div className="section-panel">
            <h2 className="section-title">Active Companies</h2>
            {eligibleCompanies.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏢</div>
                <p>No active companies at the moment</p>
              </div>
            ) : (
              <div className="list-rows">
                {eligibleCompanies.map((company, idx) => (
                  <div key={idx} className="list-row">
                    <div>
                      <div className="list-title">{company.name}</div>
                      <div className="list-meta">{company.job_role} · {company.job_location}</div>
                      <div className="list-meta" style={{ color: '#4f46e5', fontWeight: 600, marginTop: '0.25rem' }}>
                        ₹{company.package_offered} LPA
                      </div>
                    </div>
                    <span className="badge badge-secondary">{company.company_type_display}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events - Flat section, wider */}
          <div className="section-panel section-wide">
            <h2 className="section-title">Upcoming Events</h2>
            {upcomingEvents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>No upcoming events</p>
              </div>
            ) : (
              <div className="events-list">
                {upcomingEvents.map((event, idx) => (
                  <div key={idx} className="event-row">
                    <div className="event-content">
                      <div className="list-title">{event.title}</div>
                      <div className="list-meta">
                        {event.location} · {new Date(event.event_date).toLocaleString('en-US', { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </div>
                      {event.company_name && (
                        <div className="list-meta" style={{ color: '#4f46e5', marginTop: '0.25rem' }}>
                          {event.company_name}
                        </div>
                      )}
                      {event.link && (
                        <a href={event.link} target="_blank" rel="noopener noreferrer" 
                          className="event-link">
                          View Details →
                        </a>
                      )}
                    </div>
                    <span className="badge badge-info">{event.event_type_display}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Admin/Company Dashboard
  return (
    <div className="dashboard">
      <h1>Placement Dashboard</h1>
      {stats && <Statistics stats={stats} />}
    </div>
  );
};

export default Dashboard;