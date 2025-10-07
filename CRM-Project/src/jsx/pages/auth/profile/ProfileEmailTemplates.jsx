import React from 'react'
import ProfileSettingMenu from './ProfileSettingMenu'
import EmailTemplates from '../../emailManagement/EmailTemplates'

const ProfileEmailTemplates = () => {
  return (
    <div className="Profile">
            <div className="row">
                <div className="col-lg-3 my-2 ">
                    <ProfileSettingMenu />
                </div>
                <div className="col-lg-9 my-2">
                    <div className="card">
                        <div className="card-body">
                            <EmailTemplates />
                        </div>
                    </div>
                </div>

            </div>
        </div>
  )
}

export default ProfileEmailTemplates
