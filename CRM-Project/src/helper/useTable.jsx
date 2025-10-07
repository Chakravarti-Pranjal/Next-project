import React, { useContext, useState } from "react";
import DataTable from "react-data-table-component";
import { table_custom_style } from "../css/custom_style.js";
import { Tab } from "react-bootstrap";
import { ThemeContext } from "../context/ThemeContext.jsx";

const UseTable = ({
  filterValue,
  table_columns,
  setFilterValue,
  rowsPerPage,
  handlePage,
  handleRowsPerPage,
}) => {
  const { background } = useContext(ThemeContext);
  const handleSort = (column, direction) => {
    const sortedData = [...filterValue].sort((a, b) => {
      const valueA = column.selector(a);
      const valueB = column.selector(b);
      if (direction === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    setFilterValue(sortedData);
  };
  const tableBackground = background?.value === "dark" ? "lightgray" : "white";

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className="card cardPaddingZero">
          <div className="card-body p-0">
            <Tab.Content>
              <Tab.Pane eventKey="All">
                <div className="table-responsive">
                  <div
                    id="example2_wrapper"
                    className="dataTables_wrapper no-footer"
                  >
                    <DataTable
                      columns={table_columns}
                      data={filterValue}
                      pagination
                      fixedHeader
                      highlightOnHover
                      sortIcon={<i className="fa-solid fa-sort fs-4"></i>}
                      striped
                      customStyles={table_custom_style(background)}
                      defaultSortFieldId={1}
                      defaultSortAsc={true}
                      onChangePage={handlePage}
                      paginationPerPage={rowsPerPage}
                      paginationRowsPerPageOptions={[
                        10, 15, 20, 25, 30, 50, 100,
                      ]}
                      onChangeRowsPerPage={handleRowsPerPage}
                      onSort={handleSort}
                      className="custom-scrollbar"
                    />
                  </div>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="Pending">
                <h1>Active User List</h1>
              </Tab.Pane>
              <Tab.Pane eventKey="Booked">
                <h1>Inactive User List</h1>
              </Tab.Pane>
            </Tab.Content>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UseTable;
