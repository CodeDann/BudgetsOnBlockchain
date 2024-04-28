import * as React from 'react';


const TableComponent = ({ data }) => {
  
if( data.length === 0 ) { return <div><p>No Data</p></div> }
  const headers = Object.keys(data[0]);
  const rows = data.map(item => Object.values(item));

  return (
    <table className="table-content">
      <thead className='header'>
        <tr>
          {headers.map(header => <th key={header}>{header}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} >
            {row.map((cell, index) => <td key={index}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
