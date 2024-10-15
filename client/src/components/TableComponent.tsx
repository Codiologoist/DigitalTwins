const TableComponent = () => {
  // Sample data for the table
  const data = [
    { firstName: 'John', lastName: 'Doe', personalNumber: '123456' },
    { firstName: 'Jane', lastName: 'Smith', personalNumber: '654321' },
  ];

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Personal Number</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.firstName}</td>
              <td>{row.lastName}</td>
              <td>{row.personalNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
