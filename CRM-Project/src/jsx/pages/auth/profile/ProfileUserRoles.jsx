
import UserRoles from "../../userManagement/UserRoles.jsx";
import "./Profile.css"
import ProfileSettingMenu from './ProfileSettingMenu.jsx';

const ProfileUserRoles = () => {

    return (
        <div className="Profile">
            <div className="row">
                <div className="col-lg-3 my-2 ">
                    <ProfileSettingMenu />
                </div>
                <div className="col-lg-9 my-2">
                    <div className="card">
                        <div className="card-body">
                            <UserRoles />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )

}
export default ProfileUserRoles