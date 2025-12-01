import React, { useState, useEffect } from "react";
import {
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

const Companies = () => {
    const { isAdmin } = useAuth();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("ALL");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [filterPackage, setFilterPackage] = useState("ALL");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        company_type: "PRODUCT",
        website: "",
        package_offered: "",
        min_cgpa_required: "",
        eligible_branches: "CSE,IT",
        job_role: "",
        job_location: "",
        contact_person: "",
        contact_email: "",
        contact_phone: "",
        is_active: true,
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await getCompanies();
            setCompanies(response.data.results || response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching companies:", error);
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
            if (editingCompany) {
                await updateCompany(editingCompany.id, formData);
            } else {
                await createCompany(formData);
            }
            fetchCompanies();
            resetForm();
        } catch (error) {
            console.error("Error saving company:", error);
            alert("Error saving company. Please check all fields.");
        }
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setFormData({
            name: company.name,
            description: company.description,
            company_type: company.company_type,
            website: company.website,
            package_offered: company.package_offered,
            min_cgpa_required: company.min_cgpa_required,
            eligible_branches: company.eligible_branches,
            job_role: company.job_role,
            job_location: company.job_location,
            contact_person: company.contact_person,
            contact_email: company.contact_email,
            contact_phone: company.contact_phone,
            is_active: company.is_active,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this company?")) {
            try {
                await deleteCompany(id);
                fetchCompanies();
            } catch (error) {
                console.error("Error deleting company:", error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            company_type: "PRODUCT",
            website: "",
            package_offered: "",
            min_cgpa_required: "",
            eligible_branches: "CSE,IT",
            job_role: "",
            job_location: "",
            contact_person: "",
            contact_email: "",
            contact_phone: "",
            is_active: true,
        });
        setEditingCompany(null);
        setShowForm(false);
    };

    // Filter and search logic
    const filteredCompanies = companies.filter(company => {
        const matchesSearch = 
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.job_role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            company.job_location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === "ALL" || company.company_type === filterType;
        const matchesStatus = 
            filterStatus === "ALL" || 
            (filterStatus === "ACTIVE" && company.is_active) ||
            (filterStatus === "INACTIVE" && !company.is_active);
        
        let matchesPackage = true;
        if (filterPackage === "HIGH") matchesPackage = company.package_offered >= 10;
        else if (filterPackage === "MED") matchesPackage = company.package_offered >= 5 && company.package_offered < 10;
        else if (filterPackage === "LOW") matchesPackage = company.package_offered < 5;
        
        return matchesSearch && matchesType && matchesStatus && matchesPackage;
    });

    if (loading) {
        return <div className="loading">Loading companies...</div>;
    }

    return (
        <div className="companies-container">
            <div className="header">
                <h1>Companies Management</h1>
                {isAdmin && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? "Cancel" : "+ Add Company"}
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
                        placeholder="🔍 Search by company name, job role, or location..."
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
                            Company Type
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px'
                            }}
                        >
                            <option value="ALL">All Types</option>
                            <option value="PRODUCT">Product Based</option>
                            <option value="SERVICE">Service Based</option>
                            <option value="STARTUP">Startup</option>
                            <option value="MNC">MNC</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                            Package Range
                        </label>
                        <select
                            value={filterPackage}
                            onChange={(e) => setFilterPackage(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #ddd',
                                borderRadius: '6px'
                            }}
                        >
                            <option value="ALL">All Packages</option>
                            <option value="HIGH">High (10+ LPA)</option>
                            <option value="MED">Medium (5-10 LPA)</option>
                            <option value="LOW">Entry (Under 5 LPA)</option>
                        </select>
                    </div>
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
                            <option value="ALL">All Companies</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
                    Showing {filteredCompanies.length} of {companies.length} companies
                </div>
            </div>

            {isAdmin && showForm && (
                <div className="form-container">
                    <h2>
                        {editingCompany ? "Edit Company" : "Add New Company"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Company Name*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Company Type*</label>
                                <select
                                    name="company_type"
                                    value={formData.company_type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="PRODUCT">
                                        Product Based
                                    </option>
                                    <option value="SERVICE">
                                        Service Based
                                    </option>
                                    <option value="STARTUP">Startup</option>
                                    <option value="MNC">MNC</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Package (LPA)*</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="package_offered"
                                    value={formData.package_offered}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Min CGPA*</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="min_cgpa_required"
                                    value={formData.min_cgpa_required}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="10"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Eligible Branches*</label>
                                <input
                                    type="text"
                                    name="eligible_branches"
                                    value={formData.eligible_branches}
                                    onChange={handleInputChange}
                                    placeholder="CSE,IT,ECE"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Job Role*</label>
                                <input
                                    type="text"
                                    name="job_role"
                                    value={formData.job_role}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Job Location*</label>
                                <input
                                    type="text"
                                    name="job_location"
                                    value={formData.job_location}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Person*</label>
                                <input
                                    type="text"
                                    name="contact_person"
                                    value={formData.contact_person}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Email*</label>
                                <input
                                    type="email"
                                    name="contact_email"
                                    value={formData.contact_email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Contact Phone*</label>
                                <input
                                    type="tel"
                                    name="contact_phone"
                                    value={formData.contact_phone}
                                    onChange={handleInputChange}
                                    required
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
                                {editingCompany ? "Update" : "Create"} Company
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

            <div className="companies-grid">
                {filteredCompanies.length === 0 ? (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '3rem',
                        background: 'white',
                        borderRadius: '8px',
                        color: '#666'
                    }}>
                        {searchTerm || filterType !== "ALL" || filterStatus !== "ALL" || filterPackage !== "ALL"
                            ? "No companies match your search criteria"
                            : "No companies found"}
                    </div>
                ) : (
                    filteredCompanies.map((company) => (
                        <div key={company.id} className="company-card">
                        <div className="company-header">
                            <h3>{company.name}</h3>
                            <span
                                className={`badge ${company.is_active ? "badge-success" : "badge-secondary"}`}
                            >
                                {company.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <div className="company-details">
                            <p>
                                <strong>Type:</strong>{" "}
                                {company.company_type_display}
                            </p>
                            <p>
                                <strong>Role:</strong> {company.job_role}
                            </p>
                            <p>
                                <strong>Location:</strong>{" "}
                                {company.job_location}
                            </p>
                            <p>
                                <strong>Package:</strong> ₹
                                {company.package_offered} LPA
                            </p>
                            <p>
                                <strong>Min CGPA:</strong>{" "}
                                {company.min_cgpa_required}
                            </p>
                            <p>
                                <strong>Eligible:</strong>{" "}
                                {company.eligible_branches}
                            </p>
                            <p className="description">{company.description}</p>
                        </div>
                        {isAdmin && (
                            <div className="company-actions">
                                <button
                                    className="btn btn-sm btn-info"
                                    onClick={() => handleEdit(company)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(company.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))
                )}
            </div>
        </div>
    );
};

export default Companies;
