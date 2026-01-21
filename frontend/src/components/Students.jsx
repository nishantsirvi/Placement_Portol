import React, { useState, useEffect } from "react";
import {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const Students = () => {
    const { isAdmin } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBranch, setFilterBranch] = useState("ALL");
    const [filterYear, setFilterYear] = useState("ALL");
    const [filterPlaced, setFilterPlaced] = useState("ALL");
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [tempCredentials, setTempCredentials] = useState({ username: '', password: '', name: '' });
    const [showBulkUpload, setShowBulkUpload] = useState(false);
    const [uploadResults, setUploadResults] = useState(null);
    const [formData, setFormData] = useState({
        enrollment_number: "",
        name: "",
        email: "",
        phone: "",
        branch: "CSE",
        year: "3",
        cgpa: "",
        skills: "",
        is_placed: false,
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await getStudents();
            setStudents(response.data.results || response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching students:", error);
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
            if (editingStudent) {
                await updateStudent(editingStudent.id, formData);
                fetchStudents();
                resetForm();
            } else {
                // Generate credentials (not stored in state until after creation)
                const username = formData.enrollment_number.toLowerCase();
                const generatedPassword = `${formData.name.split(' ')[0].toLowerCase()}${formData.enrollment_number.slice(-4)}`;
                
                // Create new student with generated password
                await createStudent({ ...formData, password: generatedPassword });
                
                // Show credentials ONCE in a modal, then immediately clear
                setTempCredentials({
                    username: username,
                    password: generatedPassword,
                    name: formData.name
                });
                setShowCredentialsModal(true);
                
                fetchStudents();
                // Don't reset form yet - show credentials first
            }
        } catch (error) {
            console.error("Error saving student:", error);
            alert("Error saving student. Please check all fields.");
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({
            enrollment_number: student.enrollment_number,
            name: student.name,
            email: student.email,
            phone: student.phone,
            branch: student.branch,
            year: student.year,
            cgpa: student.cgpa,
            skills: student.skills,
            is_placed: student.is_placed,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await deleteStudent(id);
                fetchStudents();
            } catch (error) {
                console.error("Error deleting student:", error);
            }
        }
    };

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target.result;
                const lines = text.split('\n').filter(line => line.trim());
                
                if (lines.length < 2) {
                    alert('CSV file must have at least a header row and one data row');
                    return;
                }

                // Parse CSV
                const headers = lines[0].split(',').map(h => h.trim());
                const students = [];
                const errors = [];

                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim());
                    if (values.length !== headers.length) continue;

                    const student = {};
                    headers.forEach((header, index) => {
                        student[header] = values[index];
                    });

                    // Validate required fields
                    if (!student.enrollment_number || !student.name || !student.email) {
                        errors.push(`Row ${i + 1}: Missing required fields`);
                        continue;
                    }

                    students.push({
                        enrollment_number: student.enrollment_number,
                        name: student.name,
                        email: student.email,
                        phone: student.phone || '',
                        branch: student.branch || 'CSE',
                        year: student.year || '3',
                        cgpa: student.cgpa || '',
                        skills: student.skills || '',
                        is_placed: student.is_placed === 'true' || student.is_placed === 'True',
                        password: `${student.name.split(' ')[0].toLowerCase()}${student.enrollment_number.slice(-4)}`
                    });
                }

                // Upload students one by one
                const results = { success: 0, failed: 0, errors: [] };
                for (const student of students) {
                    try {
                        await createStudent(student);
                        results.success++;
                    } catch (error) {
                        results.failed++;
                        results.errors.push(`${student.enrollment_number}: ${error.response?.data?.message || 'Failed to create'}`);
                    }
                }

                setUploadResults(results);
                fetchStudents();
                setShowBulkUpload(false);
                setTimeout(() => setUploadResults(null), 10000);
            } catch (error) {
                alert('Error parsing CSV file. Please check the format.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const downloadSampleCSV = () => {
        const sampleCSV = `enrollment_number,name,email,phone,branch,year,cgpa,skills,is_placed
CS2021001,John Doe,john@example.com,1234567890,CSE,4,8.5,"Python,Java,React",false
CS2021002,Jane Smith,jane@example.com,1234567891,IT,3,9.0,"JavaScript,Node.js,MongoDB",false`;
        const blob = new Blob([sampleCSV], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample_students.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const resetForm = () => {
        setFormData({
            enrollment_number: "",
            name: "",
            email: "",
            phone: "",
            branch: "CSE",
            year: "3",
            cgpa: "",
            skills: "",
            is_placed: false,
        });
        setEditingStudent(null);
        setShowForm(false);
        setShowCredentialsModal(false);
        // Clear credentials immediately
        setTempCredentials({ username: '', password: '', name: '' });
    };

    const handleCredentialsAcknowledged = () => {
        // Clear sensitive data immediately after user acknowledges
        setTempCredentials({ username: '', password: '', name: '' });
        setShowCredentialsModal(false);
        resetForm();
    };

    // Filter and search logic
    const filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesBranch = filterBranch === "ALL" || student.branch === filterBranch;
        const matchesYear = filterYear === "ALL" || student.year === filterYear;
        const matchesPlaced = 
            filterPlaced === "ALL" || 
            (filterPlaced === "PLACED" && student.is_placed) ||
            (filterPlaced === "UNPLACED" && !student.is_placed);
        
        return matchesSearch && matchesBranch && matchesYear && matchesPlaced;
    });

    if (loading) {
        return <div className="loading">Loading students...</div>;
    }

    return (
        <div className="students-container">
            <div className="header">
                <h1>Students Management</h1>
                {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? "Cancel" : "+ Add Student"}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowBulkUpload(!showBulkUpload)}
                        >
                            📤 Bulk Upload
                        </button>
                    </div>
                )}
            </div>

            {/* Bulk Upload Panel */}
            {isAdmin && showBulkUpload && (
                <div className="form-container" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2>Bulk Upload Students</h2>
                        <button className="btn btn-secondary" onClick={() => setShowBulkUpload(false)}>
                            Close
                        </button>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Upload a CSV file with student data. Required columns:</p>
                        <code style={{ background: '#f3f4f6', padding: '0.5rem', borderRadius: '4px', display: 'block' }}>
                            enrollment_number, name, email, phone, branch, year, cgpa, skills, is_placed
                        </code>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <label className="btn btn-primary" style={{ margin: 0 }}>
                            Choose CSV File
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleBulkUpload}
                                style={{ display: 'none' }}
                            />
                        </label>
                        <button className="btn btn-info" onClick={downloadSampleCSV}>
                            📥 Download Sample CSV
                        </button>
                    </div>
                    {uploadResults && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: uploadResults.failed > 0 ? '#fff3cd' : '#d4edda',
                            borderRadius: '6px'
                        }}>
                            <strong>Upload Results:</strong>
                            <p>✅ Successful: {uploadResults.success}</p>
                            <p>❌ Failed: {uploadResults.failed}</p>
                            {uploadResults.errors.length > 0 && (
                                <div style={{ marginTop: '0.5rem' }}>
                                    <strong>Errors:</strong>
                                    <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                                        {uploadResults.errors.map((error, idx) => (
                                            <li key={idx} style={{ fontSize: '0.9rem' }}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Search and Filter Section */}
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
                        placeholder="🔍 Search by name, enrollment number, or email..."
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
                            Branch
                        </label>
                        <select
                            value={filterBranch}
                            onChange={(e) => setFilterBranch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px'
                            }}
                        >
                            <option value="ALL">All Branches</option>
                            <option value="CSE">CSE</option>
                            <option value="IT">IT</option>
                            <option value="ECE">ECE</option>
                            <option value="ME">ME</option>
                            <option value="CE">CE</option>
                            <option value="EE">EE</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                            Year
                        </label>
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px'
                            }}
                        >
                            <option value="ALL">All Years</option>
                            <option value="1">First Year</option>
                            <option value="2">Second Year</option>
                            <option value="3">Third Year</option>
                            <option value="4">Fourth Year</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                            Placement Status
                        </label>
                        <select
                            value={filterPlaced}
                            onChange={(e) => setFilterPlaced(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px'
                            }}
                        >
                            <option value="ALL">All Students</option>
                            <option value="PLACED">Placed</option>
                            <option value="UNPLACED">Unplaced</option>
                        </select>
                    </div>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
                    Showing {filteredStudents.length} of {students.length} students
                </div>
            </div>

            {isAdmin && showForm && (
                <div className="form-container">
                    <h2>
                        {editingStudent ? "Edit Student" : "Add New Student"}
                    </h2>
                    
                    {/* Credentials Display Modal - Shows ONCE then clears */}
                    {showCredentialsModal && (
                        <div style={{
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
                        }}>
                            <div style={{
                                background: 'white',
                                padding: '2rem',
                                borderRadius: '12px',
                                maxWidth: '500px',
                                width: '90%',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                            }}>
                                <div style={{
                                    background: '#10b981',
                                    color: 'white',
                                    padding: '1.5rem',
                                    borderRadius: '8px',
                                    marginBottom: '1rem'
                                }}>
                                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>✅ Student Account Created!</h3>
                                    <p style={{ marginBottom: '1rem' }}>Login credentials for <strong>{tempCredentials.name}</strong>:</p>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        padding: '1rem',
                                        borderRadius: '6px',
                                        fontFamily: 'monospace',
                                        fontSize: '1rem'
                                    }}>
                                        <p style={{ margin: '0.5rem 0' }}><strong>Username:</strong> {tempCredentials.username}</p>
                                        <p style={{ margin: '0.5rem 0' }}><strong>Password:</strong> {tempCredentials.password}</p>
                                    </div>
                                </div>
                                <div style={{
                                    background: '#fef3c7',
                                    border: '1px solid #f59e0b',
                                    padding: '1rem',
                                    borderRadius: '6px',
                                    marginBottom: '1rem',
                                    fontSize: '0.875rem'
                                }}>
                                    <strong>⚠️ Security Notice:</strong> Copy these credentials NOW. For security, they will be cleared immediately after you close this dialog and cannot be recovered.
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `Username: ${tempCredentials.username}\nPassword: ${tempCredentials.password}`
                                            );
                                            alert('Credentials copied to clipboard!');
                                        }}
                                        style={{ flex: 1 }}
                                    >
                                        📋 Copy to Clipboard
                                    </button>
                                    <button 
                                        className="btn btn-success"
                                        onClick={handleCredentialsAcknowledged}
                                        style={{ flex: 1, background: '#10b981' }}
                                    >
                                        ✓ I've Saved It
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Enrollment Number*</label>
                                <input
                                    type="text"
                                    name="enrollment_number"
                                    value={formData.enrollment_number}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Name*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Email*</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone*</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Branch*</label>
                                <select
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="CSE">
                                        Computer Science
                                    </option>
                                    <option value="IT">
                                        Information Technology
                                    </option>
                                    <option value="ECE">
                                        Electronics & Communication
                                    </option>
                                    <option value="ME">Mechanical</option>
                                    <option value="CE">Civil</option>
                                    <option value="EE">Electrical</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Year*</label>
                                <select
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="1">First Year</option>
                                    <option value="2">Second Year</option>
                                    <option value="3">Third Year</option>
                                    <option value="4">Fourth Year</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>CGPA*</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="cgpa"
                                    value={formData.cgpa}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="10"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Skills (comma-separated)*</label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleInputChange}
                                    placeholder="Python, Java, React"
                                    required
                                />
                            </div>
                            {!editingStudent && (
                                <div className="form-group" style={{
                                    gridColumn: '1 / -1',
                                    background: '#f3f4f6',
                                    padding: '1rem',
                                    borderRadius: '6px',
                                    border: '1px dashed #9ca3af'
                                }}>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563' }}>
                                        🔐 <strong>Auto-generated Password:</strong> {formData.name && formData.enrollment_number ? 
                                            `${formData.name.split(' ')[0].toLowerCase()}${formData.enrollment_number.slice(-4)}` : 
                                            '(firstname + last 4 digits of enrollment)'}
                                    </p>
                                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                                        Password will be auto-generated and shown once after creation. Student can change it after first login.
                                    </p>
                                </div>
                            )}
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="is_placed"
                                        checked={formData.is_placed}
                                        onChange={handleInputChange}
                                    />
                                    Is Placed
                                </label>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingStudent ? "Update" : "Create"} Student
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

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Enrollment No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Branch</th>
                            <th>Year</th>
                            <th>CGPA</th>
                            <th>Placed</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? "8" : "7"} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    {searchTerm || filterBranch !== "ALL" || filterYear !== "ALL" || filterPlaced !== "ALL" 
                                        ? "No students match your search criteria" 
                                        : "No students found"}
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.enrollment_number}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.branch}</td>
                                    <td>{student.year_display}</td>
                                    <td>{student.cgpa}</td>
                                    <td>
                                        <span
                                            className={`badge ${student.is_placed ? "badge-success" : "badge-warning"}`}
                                        >
                                            {student.is_placed ? "Yes" : "No"}
                                        </span>
                                    </td>
                                {isAdmin && (
                                    <td>
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => handleEdit(student)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() =>
                                                handleDelete(student.id)
                                            }
                                        >
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

export default Students;
