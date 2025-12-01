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
    const [createdCredentials, setCreatedCredentials] = useState(null);
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
        password: "",
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
                // Create new student
                await createStudent(formData);
                
                // Show credentials if student was created
                const username = formData.enrollment_number.toLowerCase();
                const password = formData.password || `${formData.name.split(' ')[0].toLowerCase()}${formData.enrollment_number.slice(-4)}`;
                
                setCreatedCredentials({
                    username: username,
                    password: password,
                    name: formData.name
                });
                
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
            password: "",
        });
        setEditingStudent(null);
        setShowForm(false);
        setCreatedCredentials(null);
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
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? "Cancel" : "+ Add Student"}
                    </button>
                )}
            </div>

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
                    
                    {/* Credentials Display Modal */}
                    {createdCredentials && (
                        <div style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '1.5rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem' }}>✅ Student Account Created Successfully!</h3>
                            <p style={{ marginBottom: '1rem' }}>The following login credentials have been created for <strong>{createdCredentials.name}</strong>:</p>
                            <div style={{
                                background: 'rgba(255,255,255,0.2)',
                                padding: '1rem',
                                borderRadius: '6px',
                                fontFamily: 'monospace',
                                fontSize: '1rem'
                            }}>
                                <p style={{ margin: '0.5rem 0' }}><strong>Username:</strong> {createdCredentials.username}</p>
                                <p style={{ margin: '0.5rem 0' }}><strong>Password:</strong> {createdCredentials.password}</p>
                            </div>
                            <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                                ⚠️ Please share these credentials with the student. They can change their password after first login.
                            </p>
                            <button 
                                className="btn btn-light"
                                onClick={resetForm}
                                style={{ marginTop: '1rem', background: 'white', color: '#10b981' }}
                            >
                                Got it, Close
                            </button>
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
                                <div className="form-group">
                                    <label>Login Password (optional)</label>
                                    <input
                                        type="text"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Leave empty for auto-generated password"
                                    />
                                    <small style={{ color: '#666', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                                        Default: {formData.name ? `${formData.name.split(' ')[0].toLowerCase()}` : '(firstname)'}{formData.enrollment_number.slice(-4) || '(last4digits)'}
                                    </small>
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
