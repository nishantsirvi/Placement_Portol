import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { user, logout, isAdmin, isStudent, isCompany } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setIsMobileOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleLinkClick = () => {
        if (isMobile) {
            setIsMobileOpen(false);
        }
    };

    const getRoleBadge = () => {
        if (isAdmin) return { text: "Admin", color: "#667eea" };
        if (isStudent) return { text: "Student", color: "#10b981" };
        if (isCompany) return { text: "Company", color: "#f59e0b" };
        return { text: "User", color: "#6b7280" };
    };

    const roleBadge = getRoleBadge();

    return (
        <>
            {/* Mobile Menu Button */}
            {isMobile && (
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>
            )}

            {/* Sidebar Overlay for Mobile */}
            {isMobile && isMobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <nav className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isMobile && isMobileOpen ? "mobile-open" : ""}`}>
            <button
                className="sidebar-toggle"
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? "Expand" : "Collapse"}
                style={{ display: isMobile ? 'none' : 'block' }}
            >
                {isCollapsed ? "☰" : "✕"}
            </button>

            <div className="sidebar-header">
                <Link to="/dashboard" className="sidebar-brand">
                    <h2>🎓</h2>
                    {!isCollapsed && <span>Placement Tracker</span>}
                </Link>
            </div>

            <ul className="sidebar-menu">
                <li>
                    <Link to="/dashboard" title="Dashboard" onClick={handleLinkClick}>
                        <span className="icon">📊</span>
                        {!isCollapsed && (
                            <span className="text">Dashboard</span>
                        )}
                    </Link>
                </li>
                {/* Students page - only for admin and company users */}
                {!isStudent && (
                    <li>
                        <Link to="/students" title="Students" onClick={handleLinkClick}>
                            <span className="icon">👨‍🎓</span>
                            {!isCollapsed && <span className="text">Students</span>}
                        </Link>
                    </li>
                )}
                <li>
                    <Link to="/companies" title="Companies" onClick={handleLinkClick}>
                        <span className="icon">🏢</span>
                        {!isCollapsed && (
                            <span className="text">Companies</span>
                        )}
                    </Link>
                </li>
                <li>
                    <Link to="/placement-progress" title="Progress" onClick={handleLinkClick}>
                        <span className="icon">📈</span>
                        {!isCollapsed && <span className="text">Progress</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/important-dates" title="Events" onClick={handleLinkClick}>
                        <span className="icon">📅</span>
                        {!isCollapsed && <span className="text">Events</span>}
                    </Link>
                </li>
            </ul>

            {/* User Profile Section */}
            <div className="sidebar-footer">
                <div
                    className="user-profile"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{ cursor: "pointer", position: "relative" }}
                >
                    {!isCollapsed && (
                        <>
                            <div className="user-info">
                                <div className="user-avatar">
                                    {user?.first_name?.[0] ||
                                        user?.username?.[0] ||
                                        "👤"}
                                </div>
                                <div className="user-details">
                                    <div className="user-name">
                                        {user?.first_name ||
                                            user?.username ||
                                            "User"}
                                    </div>
                                    <div
                                        className="user-role"
                                        style={{
                                            fontSize: "11px",
                                            padding: "2px 8px",
                                            borderRadius: "10px",
                                            backgroundColor: roleBadge.color,
                                            color: "white",
                                            display: "inline-block",
                                            marginTop: "4px",
                                        }}
                                    >
                                        {roleBadge.text}
                                    </div>
                                </div>
                            </div>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="user-dropdown">
                                    <div
                                        className="dropdown-item"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowUserMenu(false);
                                            handleLinkClick();
                                            navigate("/profile");
                                        }}
                                    >
                                        <span>👤 Profile</span>
                                    </div>
                                    <div
                                        className="dropdown-item"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowUserMenu(false);
                                            handleLinkClick();
                                            navigate("/settings");
                                        }}
                                    >
                                        <span>⚙️ Settings</span>
                                    </div>
                                    <div className="dropdown-divider"></div>
                                    <div
                                        className="dropdown-item logout"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleLinkClick();
                                            handleLogout();
                                        }}
                                    >
                                        <span>🚪 Logout</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {isCollapsed && (
                        <div
                            className="user-avatar-collapsed"
                            title={`${user?.first_name || user?.username} (${roleBadge.text})`}
                        >
                            {user?.first_name?.[0] ||
                                user?.username?.[0] ||
                                "👤"}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .sidebar-footer {
                    margin-top: auto;
                    padding: 15px;
                    border-top: 1px solid #e5e7eb;
                }

                .user-profile {
                    position: relative;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px;
                    border-radius: 8px;
                    transition: background-color 0.2s;
                }

                .user-info:hover {
                    background-color: #f3f4f6;
                }

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(
                        135deg,
                        #667eea 0%,
                        #764ba2 100%
                    );
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 16px;
                    text-transform: uppercase;
                }

                .user-avatar-collapsed {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(
                        135deg,
                        #667eea 0%,
                        #764ba2 100%
                    );
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 16px;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: transform 0.2s;
                }

                .user-avatar-collapsed:hover {
                    transform: scale(1.1);
                }

                .user-details {
                    flex: 1;
                }

                .user-name {
                    font-weight: 600;
                    font-size: 14px;
                    color: #1f2937;
                }

                .user-dropdown {
                    position: absolute;
                    bottom: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    margin-bottom: 8px;
                    overflow: hidden;
                    z-index: 1000;
                    animation: slideUp 0.2s ease-out;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .dropdown-item {
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    font-size: 14px;
                    color: #374151;
                }

                .dropdown-item:hover {
                    background-color: #f3f4f6;
                }

                .dropdown-item.logout {
                    color: #dc2626;
                }

                .dropdown-item.logout:hover {
                    background-color: #fee;
                }

                .dropdown-divider {
                    height: 1px;
                    background-color: #e5e7eb;
                    margin: 4px 0;
                }

                .dropdown-item span {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
            `}</style>
        </nav>
        </>
    );
};

export default Navbar;
