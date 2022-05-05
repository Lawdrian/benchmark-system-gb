import React, { FunctionComponent } from "react";

type LoginProps = {

}

const PageLogin: FunctionComponent<LoginProps> = (props) => {
    return (
        <div id="login" className="page">
          <p style={{textAlign: "center"}}> Login </p>
        </div>
    );
}

export default PageLogin;