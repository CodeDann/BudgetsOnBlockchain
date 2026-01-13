// import * as React from 'react';


// const TableComponent = ({ data }) => {


// function searchFunc() {
//   // Declare variables
//   var input, filter, table, tr, td, i, txtValue;
//   input = document.getElementById("searchInput");
//   filter = input.value.toUpperCase();
//   table = document.getElementById("TrxTable");
//   tr = table.getElementsByTagName("tr");

//   // Loop through all table rows, and hide those who don't match the search query
//   for (let i = 1; i < tr.length; i++) {
//     const td = tr[i].getElementsByTagName("td");
//     let description = td[4].textContent || td[4].innerText; // Assuming description is the third column (index 2)
//     if (description.toUpperCase().indexOf(filter) > -1) {
//       tr[i].style.display = "";
//     } else {
//       tr[i].style.display = "none";
//     }
//   }
// }

  
// if( data.length === 0 ) { return <div><p>No Data</p></div> }
//   const headers = Object.keys(data[0]);
//   const rows = data.map(item => Object.values(item));

//   return (
//     <>

//     <input
//         type="text"
//         id="searchInput"
//         onKeyUp={searchFunc}
//         placeholder="Search for a transaction.."
//       />
//     <table className="table-content" id="TrxTable">

//       <thead className='header'>
//         <tr>
//           {headers.map(header => <th key={header}>{header}</th>)}
//         </tr>
//       </thead>
//       <tbody>
//         {rows.map((row, index) => (
//           <tr key={index} >
//             {row.map((cell, index) => <td key={index}>{cell}</td>)}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//     </>
//   );
// };

// export default TableComponent;

import React, { useState } from 'react';

const JsonTable = ({ data }) => {
  const [filter, setFilter] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('');

  const searchFunc = () => {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("TrxTable");
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
      const td = tr[i].getElementsByTagName("td");
      if (selectedColumn !== '') {
        const columnIndex = headers.indexOf(selectedColumn);
        if (columnIndex > -1) {
          const txtValue = td[columnIndex].textContent || td[columnIndex].innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  };

  if (data.length === 0) {
    return <div><p>No Data</p></div>;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map(item => Object.values(item));

  return (
    <>
      <div>
        <select onChange={(e) => setSelectedColumn(e.target.value)}>
          <option value="">Select Column</option>
          {headers.map((header, index) => (
            <option key={index} value={header}>{header}</option>
          ))}
        </select>
        <input
          type="text"
          id="searchInput"
          onKeyUp={searchFunc}
          placeholder="Search..."
        />
      </div>

      <table className="table-content" id="TrxTable">
        <thead className='header'>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default JsonTable;