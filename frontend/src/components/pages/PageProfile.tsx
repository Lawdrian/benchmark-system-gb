import React, { FunctionComponent } from "react";

type ProfileProps = {

}

const PageProfile: FunctionComponent<ProfileProps> = (props) => {
    return (
        <div id="manage-profile" className="page">
          <p style={{textAlign: "center"}}> Profil </p>
        </div>
    );
}

export default PageProfile;