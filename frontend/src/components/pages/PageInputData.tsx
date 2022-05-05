import React, { FunctionComponent } from "react";

type InputDataProps = {

}

const PageInputDataProps: FunctionComponent<InputDataProps> = (props) => {
    return (
        <div id="input-data" className="page">
          <p style={{textAlign: "center"}}> Dateneingabe </p>
        </div>
    );
}

export default PageInputDataProps;