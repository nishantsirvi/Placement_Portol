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
        <h1>Welcome, {user?.first_name || user?.username}! 👋</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Track your placement journey and stay updated</p>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Applications</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{appliedCount}</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Selected/Offers</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{selectedCount}</div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Pending</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{pendingCount}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          {/* My Application Status */}
          <div>
            <h2 style={{ marginBottom: '1rem' }}>📊 My Applications</h2>
            <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {myPlacements.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                  <p>No applications yet. Check out the companies below!</p>
                </div>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {myPlacements.map((placement, idx) => (
                    <div key={idx} style={{
                      padding: '1rem',
                      borderBottom: idx < myPlacements.length - 1 ? '1px solid #eee' : 'none'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{placement.company_name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: '#666' }}>{placement.current_stage_name || 'Applied'}</span>
                        <span className={`badge badge-${
                          placement.status === 'OFFER_ACCEPTED' || placement.status === 'SELECTED' ? 'success' :
                          placement.status === 'REJECTED' ? 'danger' :
                          placement.status === 'IN_PROGRESS' ? 'warning' : 'info'
                        }`}>
                          {placement.status_display}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Eligible Companies */}
          <div>
            <h2 style={{ marginBottom: '1rem' }}>🏢 Active Companies</h2>
            <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {eligibleCompanies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
                  <p>No active companies at the moment</p>
                </div>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {eligibleCompanies.map((company, idx) => (
                    <div key={idx} style={{
                      padding: '1rem',
                      borderBottom: idx < eligibleCompanies.length - 1 ? '1px solid #eee' : 'none'
                    }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{company.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
                        {company.job_role} • {company.job_location}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.875rem', color: '#667eea', fontWeight: 'bold' }}>
                          ₹{company.package_offered} LPA
                        </span>
                        <span className="badge badge-secondary">{company.company_type_display}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{ gridColumn: 'span 2' }}>
            <h2 style={{ marginBottom: '1rem' }}>📅 Upcoming Events</h2>
            <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {upcomingEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                  <p>No upcoming events</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {upcomingEvents.map((event, idx) => (
                    <div key={idx} style={{
                      padding: '1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: '#f9fafb'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{event.title}</div>
                          <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                            📍 {event.location} • 📅 {new Date(event.event_date).toLocaleString()}
                          </div>
                          {event.company_name && (
                            <div style={{ fontSize: '0.875rem', color: '#667eea' }}>
                              🏢 {event.company_name}
                            </div>
                          )}
                        </div>
                        <span className="badge badge-primary">{event.event_type_display}</span>
                      </div>
                      {event.link && (
                        <a href={event.link} target="_blank" rel="noopener noreferrer" 
                          style={{ fontSize: '0.875rem', color: '#667eea', textDecoration: 'underline' }}>
                          🔗 Event Link
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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