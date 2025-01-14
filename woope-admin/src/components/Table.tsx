import React, { ReactNode } from "react";

interface Props {
  headers: ReactNode[];
  rows: string[][];
}

const Table = ({ headers, rows }: Props) => {
  return (
    <>
      <table className="table table-hover">
        <thead>
          <tr>
            {headers.map((e, index) => {
              return (
                <th scope="col" key={index}>
                  {e}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            return (
              <tr key={index}>
                {row.map((e, index) => {
                  return <td key={index}>{e}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 && <p>No Results</p>}
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">
            <a className="page-link" href="#">
              Previous
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              1
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              2
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              3
            </a>
          </li>
          <li className="page-item">
            <a className="page-link" href="#">
              Next
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Table;
