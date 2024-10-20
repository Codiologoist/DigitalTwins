import React from 'react';

// Define types for the props
interface TableProps {
  columns: string[];
  data: Array<{ [key: string]: any }>;  // Array of objects representing the table rows, each with key-value pairs for cell data
  onEdit?: (row: { [key: string]: string | number }) => void; // Optional edit function for admin
  onDelete?: (row: { [key: string]: string | number }) => void; // Optional delete function for admin
}

const Table: React.FC<TableProps> = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {/* Map through the columns to create table header cells */}
            {columns.map((column, index) => (
              <th key={index}>{column}</th>// Use the index as the key for header cells 
            ))}
            {onEdit && onDelete && <th>Actions</th>} {/* Conditional column for actions */}
          </tr>
        </thead>
        <tbody>
          {/* Map through the data to create table rows */}
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}> {/* Use the row index as the key for rows */}
              {/* Map through the columns to create table data cells */}
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{row[column]}</td>  // Display the data for each cell based on column name
              ))}
              {onEdit && onDelete && ( // show action buttons only for admin
                <td>
                  <div className="actions"> {/* Added actions class here */}
                    <button onClick={() => onEdit(row)}>Edit</button> {/* Edit button */}
                    <button onClick={() => onDelete(row)}>Delete</button> {/* Delete button */}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
