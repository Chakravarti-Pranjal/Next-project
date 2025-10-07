import React from "react";
import { Routes, Route, Link, useNavigate, NavLink } from "react-router-dom";
const ProfileSettingMenu = () => {
  return (
    <div className="card ps-2 profile-setting">
      {/* style={{minHeight:" calc(100vh - 152px)"}} */}
      <div className="card-body">
        <div className="row">
          <div className="card cardDefaultPadding">
            <div className="card-body">
              <h2>Setup</h2>
              <span className="profileSettingTitle">General</span>
              <ul>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `my-1 profileSettinglink ${
                        isActive ? "profileSettinglinkActive" : ""
                      }`
                    }
                    to="/user-profile"
                    end
                  >
                    <i className="fa-solid fa-gear me-2"></i> Personal Setting
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `my-1 profileSettinglink ${
                        isActive ? "profileSettinglinkActive" : ""
                      }`
                    }
                    // onClick={(e) => e.preventDefault()}
                    to="/user-profile/email-setting"
                  >
                    <i className="fa-solid fa-envelope me-2"></i> Email Setting
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="card cardDefaultPadding">
            <div className="card-body">
              <span className="profileSettingTitle">User & Permissions</span>
              <ul>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `my-1 profileSettinglink ${
                        isActive ? "profileSettinglinkActive" : ""
                      }`
                    }
                    to="/user-profile/user"
                  >
                    <i className="fa-solid fa-user me-2"></i> User
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `my-1 profileSettinglink ${
                        isActive ? "profileSettinglinkActive" : ""
                      }`
                    }
                    to="/user-profile/roles"
                  >
                    <i className="fas fa-edit me-2"></i> Role
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `my-1 profileSettinglink ${
                        isActive ? "profileSettinglinkActive" : ""
                      }`
                    }
                    // onClick={(e) => e.preventDefault()}
                    to="/user-profile/profile-list"
                  >
                    <i className="fa-solid fa-user me-2"></i> Profiles
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `my-1 profileSettinglink ${
                        isActive ? "profileSettinglinkActive" : ""
                      }`
                    }
                    // onClick={(e) => e.preventDefault()}
                    to="/user-profile/department"
                  >
                    <i className="fa-solid fa-user me-2"></i> User Department
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="card cardDefaultPadding">
            <div className="card-body">
              <span className="profileSettingTitle">Customization</span>
              <ul>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `my-1 profileSettinglink ${
                        isActive ? "profileSettinglinkActive" : ""
                      }`
                    }
                    to="/user-profile/module"
                  >
                    <i className="fas fa-edit me-2"></i> Module
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `my-1 profileSettinglink ${
                        isActive ? "profileSettinglinkActive" : ""
                      }`
                    }
                    to="/user-profile/email-templates"
                  >
                    <i className="fas fa-edit me-2"></i> Email Templates
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `my-1 profileSettinglink ${
                        isActive ? "profileSettinglinkActive" : ""
                      }`
                    }
                    to="/user-profile/company-setting"
                  >
                    <i className="fa-solid fa-gear me-2"></i> Setting
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `my-1 profileSettinglink ${
                        isActive ? "profileSettinglinkActive" : ""
                      }`
                    }
                    to="/user-profile/stage-master"
                  >
                    <i className="fa-solid fa-gear me-2"></i> Stage Master
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingMenu;
