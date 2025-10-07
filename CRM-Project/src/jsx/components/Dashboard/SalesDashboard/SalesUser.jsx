import React from "react";
import { Link, useLocation } from "react-router-dom";

const SalesUser = () => {
  const location = useLocation();

  const categories = [
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
    { name: "Ajay verma", iconClass: "fa-circle", iconColor: "icon-warning" },
  ];

  return (
    <div className="col-md-12">
      <div className="SalesUsers">
        <div className="email-left-box">
          <div className="p-0">
            <Link
              to="/sales-dashboard"
              className="btn btn-primary btn-block text-start border-0"
            >
              All user
            </Link>
          </div>
          <div className="mail-list rounded overflow-hidden mt-3">
            {categories.map((category, index) => (
              <Link
                to="/sales-dashboard"
                className="list-group-item py-2"
                key={index}
              >
                <span className={category.iconColor}> {category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesUser;
