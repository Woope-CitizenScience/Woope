import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  headers: ReactNode[];
  rows: string[][];
  navigateTo?: string;
}


const Table = ({ headers, rows, navigateTo }: Props) => {
  const navigate = useNavigate();
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
              <tr onClick={() => navigate(navigateTo + '/' + row[0])} key={index}>
                {row.map((e, index) => {
                  return <td key={index}>{e}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.length === 0 && <p className="text-center">No Results</p>}
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
