import React, { FunctionComponent } from "react";

type RegisterProps = {

}

const PageRegister: FunctionComponent<RegisterProps> = (props) => {
    return (
        <div id="register" className="page">
          <p style={{textAlign: "center"}}> Registrieren </p>
        </div>
    );
}

export default PageRegister;