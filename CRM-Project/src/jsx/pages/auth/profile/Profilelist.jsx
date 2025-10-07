
import ProfileList from "../../userManagement/ProfileList.jsx";
import "./Profile.css"
import ProfileSettingMenu from './ProfileSettingMenu.jsx';

const Profilelist = () => {

  return (
    <div className="Profile">
      <div className="row">
        <div className="col-lg-3 my-2 ">
          <ProfileSettingMenu />
        </div>
        <div className="col-lg-9 my-2">
          <div className="card">
            <div className="card-body">
              <ProfileList />
            </div>
          </div>
        </div>

      </div>
    </div>
  )

}
export default Profilelist