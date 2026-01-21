import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const Profile = () => {
  const { user, isAdmin, isStudent, isCompany } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/auth/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = () => {
    if (isAdmin) return { text: "Admin", color: "#667eea" };
    if (isStudent) return { text: "Student", color: "#10b981" };
    if (isCompany) return { text: "Company", color: "#f59e0b" };
    return { text: "User", color: "#6b7280" };
  };

  const roleBadge = getRoleBadge();

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="header">
        <div>
          <h1>Profile</h1>
        </div>
      </div>

      {/* Profile Header */}
      <div className="form-container" style={{ background: `linear-gradient(135deg, ${roleBadge.color}15 0%, ${roleBadge.color}05 100%)`, border: `2px solid ${roleBadge.color}30` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '12px',
            background: roleBadge.color,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '42px',
            fontWeight: '700',
            textTransform: 'uppercase',
            flexShrink: 0
          }}>
            {user?.first_name?.[0] || user?.username?.[0] || 'U'}
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', fontWeight: '600' }}>
              {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}` 
                : user?.username || 'User'}
            </h2>
            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.75rem' }}>@{user?.username}</p>
            <span className={`badge badge-${isAdmin ? 'primary' : isStudent ? 'success' : 'warning'}`}>
              {roleBadge.text}
            </span>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => navigate('/settings')}
            style={{ marginLeft: 'auto' }}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Account Information */}
      <div className="form-container">
        <h2 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '600' }}>
          Contact Information
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</div>
            <div style={{ fontSize: '1rem', fontWeight: '500' }}>{user?.email || '—'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</div>
            <div style={{ fontSize: '1rem', fontWeight: '500' }}>{user?.phone || '—'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Username</div>
            <div style={{ fontSize: '1rem', fontWeight: '500' }}>{user?.username || '—'}</div>
          </div>
        </div>
      </div>

      {/* Student Specific Information */}
      {isStudent && profileData && (
        <div className="form-container">
          <h2 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '600' }}>
            Academic Details
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {profileData.enrollment_number && (
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Enrollment No.</div>
                <div style={{ fontSize: '1rem', fontWeight: '500' }}>{profileData.enrollment_number}</div>
              </div>
            )}

            {profileData.branch && (
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Branch</div>
                <div style={{ fontSize: '1rem', fontWeight: '500' }}>{profileData.branch}</div>
              </div>
            )}

            {profileData.year && (
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Year</div>
                <div style={{ fontSize: '1rem', fontWeight: '500' }}>{profileData.year}</div>
              </div>
            )}

            {profileData.cgpa !== null && profileData.cgpa !== undefined && (
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>CGPA</div>
                <div style={{ fontSize: '1rem', fontWeight: '500' }}>{profileData.cgpa}</div>
              </div>
            )}
          </div>

          {(profileData.resume || profileData.placement_status) && (
            <div style={{ paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
              {profileData.placement_status && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Placement Status</div>
                  <span className={`badge badge-${profileData.placement_status === 'PLACED' ? 'success' : profileData.placement_status === 'IN_PROCESS' ? 'warning' : 'secondary'}`}>
                    {profileData.placement_status?.replace('_', ' ')}
                  </span>
                </div>
              )}

              {profileData.resume && (
                <div>
                  <a 
                    href={profileData.resume} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Company Specific Information */}
      {isCompany && profileData && (
        <div className="form-container">
          <h2 style={{ marginBottom: '1.25rem', fontSize: '1.1rem', fontWeight: '600' }}>
            Company Details
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {profileData.company_name && (
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company Name</div>
                <div style={{ fontSize: '1rem', fontWeight: '500' }}>{profileData.company_name}</div>
              </div>
            )}

            {profileData.industry && (
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Industry</div>
                <div style={{ fontSize: '1rem', fontWeight: '500' }}>{profileData.industry}</div>
              </div>
            )}

            {profileData.website && (
              <div>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Website</div>
                <a 
                  href={profileData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ fontSize: '1rem', fontWeight: '500', color: '#667eea', textDecoration: 'none' }}
                >
                  {profileData.website}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;