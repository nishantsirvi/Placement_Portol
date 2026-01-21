import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Companies from "./components/Companies";
import PlacementProgress from "./components/PlacementProgress";
import ImportantDates from "./components/ImportantDates";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import UserManagement from "./components/UserManagement";
import "./App.css";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <div className="App">
                                    <Navbar />
                                    <div className="main-content">
                                        <Routes>
                                            <Route
                                                path="/"
                                                element={
                                                    <Navigate
                                                        to="/dashboard"
                                                        replace
                                                    />
                                                }
                                            />
                                            <Route
                                                path="/dashboard"
                                                element={<Dashboard />}
                                            />
                                            {/* Students page - restricted to admin and company only */}
                                            <Route
                                                path="/students"
                                                element={
                                                    <ProtectedRoute allowedRoles={['ADMIN', 'COMPANY']}>
                                                        <Students />
                                                    </ProtectedRoute>
                                                }
                                            />                                            {/* User Management - Admin only */}
                                            <Route
                                                path="/users"
                                                element={
                                                    <ProtectedRoute allowedRoles={['ADMIN']}>
                                                        <UserManagement />
                                                    </ProtectedRoute>
                                                }
                                            />                                            <Route
                                                path="/companies"
                                                element={<Companies />}
                                            />
                                            <Route
                                                path="/placement-progress"
                                                element={<PlacementProgress />}
                                            />
                                            <Route
                                                path="/important-dates"
                                                element={<ImportantDates />}
                                            />
                                            <Route
                                                path="/profile"
                                                element={<Profile />}
                                            />
                                            <Route
                                                path="/settings"
                                                element={<Settings />}
                                            />
                                        </Routes>
                                    </div>
                                </div>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
