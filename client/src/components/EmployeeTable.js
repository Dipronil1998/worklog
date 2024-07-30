import React from 'react';

const EmployeeTable = ({ employees }) => {
  if (!employees || employees.length === 0) {
    return <p>No employees found.</p>;
  }

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  };

  const thStyle = {
    border: '1px solid #ddd',
    padding: '12px',
    backgroundColor: '#f4f4f4',
    fontWeight: 'bold',
    textAlign: 'left',
  };

  const tdStyle = {
    border: '1px solid #ddd',
    padding: '12px',
  };

  const trStyle = {
    backgroundColor: '#f9f9f9',
  };

  const headerStyle = {
    backgroundColor: '#f4f4f4',
  };

  return (
    <table style={tableStyle}>
      <thead style={headerStyle}>
        <tr>
          <th style={thStyle}>Full Name</th>
          <th style={thStyle}>Email</th>
          <th style={thStyle}>Phone</th>
          <th style={thStyle}>Role</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((employee, index) => (
          <tr key={employee._id} style={index % 2 === 0 ? trStyle : {}}>
            <td style={tdStyle}>{employee.fullName}</td>
            <td style={tdStyle}>{employee.email}</td>
            <td style={tdStyle}>{employee.phone}</td>
            <td style={tdStyle}>{employee.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EmployeeTable;
