
import UserDepartmentList from "../../userManagement/UserDepartmentList.jsx";
import "./Profile.css"
import ProfileSettingMenu from './ProfileSettingMenu.jsx';

const ProfileDepartment = () => {

  return (
    <div className="Profile">
      <div className="row">
        <div className="col-lg-3 my-2 ">
          <ProfileSettingMenu />
        </div>
        <div className="col-lg-9 my-2">
          <div className="card">
            <div className="card-body">
              <UserDepartmentList />
            </div>
          </div>
        </div>

      </div>
    </div>
  )

}
export default ProfileDepartment;
