import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Statistics = ({ stats }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const statusData = stats.status_breakdown.map(item => ({
    name: item.status.replace('_', ' '),
    value: item.count
  }));

  const branchData = stats.branch_wise_placement.map(item => ({
    name: item.branch,
    placed: item.count
  }));

  return (
    <div className="statistics">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Students</h3>
          <p className="stat-number">{stats.total_students}</p>
        </div>
        <div className="stat-card">
          <h3>Placed Students</h3>
          <p className="stat-number">{stats.placed_students}</p>
        </div>
        <div className="stat-card">
          <h3>Placement %</h3>
          <p className="stat-number">{stats.placement_percentage}%</p>
        </div>
        <div className="stat-card">
          <h3>Total Companies</h3>
          <p className="stat-number">{stats.total_companies}</p>
        </div>
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p className="stat-number">{stats.total_applications}</p>
        </div>
        <div className="stat-card">
          <h3>Offers Received</h3>
          <p className="stat-number">{stats.offers_received}</p>
        </div>
        <div className="stat-card">
          <h3>Offers Accepted</h3>
          <p className="stat-number">{stats.offers_accepted}</p>
        </div>
        <div className="stat-card">
          <h3>Average Package</h3>
          <p className="stat-number">₹{stats.average_package} LPA</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Application Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Branch-wise Placement</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={branchData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="placed" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;