import React, { useState, useEffect } from 'react';
import { 
  getPlacementProgress,
  getMyProgress,
  createPlacementProgress, 
  updatePlacementProgress,
  deletePlacementProgress,
  getStudents,
  getCompanies,
  getStages
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const PlacementProgress = () => {
  const { isStudent } = useAuth();
  const [placements, setPlacements] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [debugInfo, setDebugInfo] = useState(null);
  const [formData, setFormData] = useState({
    student: '',
    company: '',
    current_stage: '',
    status: 'APPLIED',
    notes: ''
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      if (isStudent) {
        // Students - use debug endpoint
        const response = await getMyProgress();
        setPlacements(response.data.results || []);
        setDebugInfo(response.data.debug);
      } else {
        // Admins and companies need all data
        const [placementsRes, studentsRes, companiesRes, stagesRes] = await Promise.all([
          getPlacementProgress(),
          getStudents(),
          getCompanies(),
          getStages()
        ]);
        
        setPlacements(placementsRes.data.results || placementsRes.data);
        setStudents(studentsRes.data.results || studentsRes.data);
        setCompanies(companiesRes.data.results || companiesRes.data);
        setStages(stagesRes.data.results || stagesRes.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlacement) {
        await updatePlacementProgress(editingPlacement.id, formData);
      } else {
        await createPlacementProgress(formData);
      }
      fetchData();
      resetForm();
    } catch (error) {
      console.error('Error saving placement:', error);
      alert('Error saving placement progress. Please check all fields.');
    }
  };

  const handleEdit = (placement) => {
    setEditingPlacement(placement);
    setFormData({
      student: placement.student,
      company: placement.company,
      current_stage: placement.current_stage || '',
      status: placement.status,
      notes: placement.notes
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this placement record?')) {
      try {
        await deletePlacementProgress(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting placement:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student: '',
      company: '',
      current_stage: '',
      status: 'APPLIED',
      notes: ''
    });
    setEditingPlacement(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      'APPLIED': 'badge-info',
      'IN_PROGRESS': 'badge-warning',
      'SHORTLISTED': 'badge-primary',
      'SELECTED': 'badge-success',
      'REJECTED': 'badge-danger',
      'OFFER_RECEIVED': 'badge-success',
      'OFFER_ACCEPTED': 'badge-success',
      'OFFER_DECLINED': 'badge-secondary'
    };
    return colors[status] || 'badge-secondary';
  };

  // Filter and search logic
  const filteredPlacements = placements.filter(placement => {
    const matchesSearch = 
      placement.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placement.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      placement.student_enrollment?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "ALL" || placement.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading placement progress...</div>;
  }

  return (
    <div className="placement-progress-container">
      <div className="header">
        <h1>{isStudent ? 'My Placement Progress' : 'Placement Progress Tracking'}</h1>
        {!isStudent && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Placement Record'}
          </button>
        )}
      </div>

      {/* Debug Info for Students */}
      {debugInfo && (
        <div style={{
          background: debugInfo.has_student_profile ? '#d4edda' : '#fff3cd',
          border: `1px solid ${debugInfo.has_student_profile ? '#c3e6cb' : '#ffc107'}`,
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}>
          <strong>Account Status:</strong>
          <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            <li>Username: {debugInfo.username}</li>
            <li>Email: {debugInfo.email}</li>
            <li>Role: {debugInfo.role}</li>
            <li>Has Student Profile: {debugInfo.has_student_profile ? '✅ Yes' : '❌ No'}</li>
            {debugInfo.student_profile_id && <li>Student Profile ID: {debugInfo.student_profile_id}</li>}
          </ul>
          {!debugInfo.has_student_profile && (
            <p style={{ marginTop: '0.5rem', marginBottom: 0, color: '#856404' }}>
              ⚠️ Your account is not linked to a student profile. Please contact admin to link your account.
            </p>
          )}
        </div>
      )}

      {/* Search and Filter Section */}
      {placements.length > 0 && (
        <div className="search-filter-container" style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="🔍 Search by student name, enrollment, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '6px'
              }}
            />
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '6px'
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="APPLIED">Applied</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="SELECTED">Selected</option>
                <option value="REJECTED">Rejected</option>
                <option value="OFFER_RECEIVED">Offer Received</option>
                <option value="OFFER_ACCEPTED">Offer Accepted</option>
                <option value="OFFER_DECLINED">Offer Declined</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            Showing {filteredPlacements.length} of {placements.length} records
          </div>
        </div>
      )}

      {isStudent && placements.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ color: '#374151', marginBottom: '8px' }}>No Placement Records Yet</h3>
          <p style={{ color: '#6b7280' }}>Your placement applications will appear here once added by the admin.</p>
        </div>
      )}

      {!isStudent && showForm && (
        <div className="form-container">
          <h2>{editingPlacement ? 'Edit Placement Record' : 'Add New Placement Record'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Student*</label>
                <select name="student" value={formData.student} onChange={handleInputChange} required>
                  <option value="">Select Student</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.enrollment_number} - {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Company*</label>
                <select name="company" value={formData.company} onChange={handleInputChange} required>
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name} - {company.job_role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Current Stage</label>
                <select name="current_stage" value={formData.current_stage} onChange={handleInputChange}>
                  <option value="">Select Stage</option>
                  {stages.map(stage => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Status*</label>
                <select name="status" value={formData.status} onChange={handleInputChange} required>
                  <option value="APPLIED">Applied</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="SELECTED">Selected</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="OFFER_RECEIVED">Offer Received</option>
                  <option value="OFFER_ACCEPTED">Offer Accepted</option>
                  <option value="OFFER_DECLINED">Offer Declined</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Add any notes or comments..."
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingPlacement ? 'Update' : 'Create'} Record
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isStudent && placements.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <h3 style={{ color: '#374151', marginBottom: '8px' }}>No Placement Records Yet</h3>
          <p style={{ color: '#6b7280' }}>Your placement applications will appear here once added by the admin.</p>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {!isStudent && <th>Student</th>}
              {!isStudent && <th>Enrollment No.</th>}
              <th>Company</th>
              <th>Current Stage</th>
              <th>Status</th>
              <th>Application Date</th>
              {!isStudent && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPlacements.length === 0 ? (
              <tr>
                <td colSpan={isStudent ? "5" : "7"} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  {searchTerm || filterStatus !== "ALL"
                    ? "No placement records match your search criteria"
                    : "No placement records found."}
                </td>
              </tr>
            ) : (
              filteredPlacements.map((placement) => (
                <tr key={placement.id}>
                  {!isStudent && <td>{placement.student_name}</td>}
                  {!isStudent && <td>{placement.student_enrollment}</td>}
                  <td>{placement.company_name}</td>
                  <td>{placement.current_stage_name || 'N/A'}</td>
                  <td>
                    <span className={`badge ${getStatusColor(placement.status)}`}>
                      {placement.status_display}
                    </span>
                  </td>
                  <td>{new Date(placement.application_date).toLocaleDateString()}</td>
                  {!isStudent && (
                    <td>
                      <button className="btn btn-sm btn-info" onClick={() => handleEdit(placement)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(placement.id)}>
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlacementProgress;