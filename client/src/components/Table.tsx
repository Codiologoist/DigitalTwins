// Define types for the props
interface TableProps<T> {
  columns: (keyof T)[];
  data: T[];  // Array of objects representing the table rows
  onEdit?: (row: T) => void; // Optional edit function for admin
  onDelete?: (row: T) => void; // Optional delete function for admin
}

const Table= <T,> ({ columns, data, onEdit, onDelete }: TableProps<T>) => {
  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {/* Map through the columns to create table header cells */}
            {columns.map((column, index) => (
              <th key={index}>{String(column)}</th>// Use the index as the key for header cells 
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
                <td key={colIndex}>{row[column] as unknown as string | number}</td>
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
