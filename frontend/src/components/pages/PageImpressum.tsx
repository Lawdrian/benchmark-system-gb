import React from "react";
import {Divider, Typography} from "@mui/material";

/**
 * This component renders the imprint page.
 */
const PageImpressum = () => {
    return (
        <div id="login" className="page">
            <Typography variant={"h4"}>
                Impressum
            </Typography>
            <Divider sx={{ borderBottomWidth: 3, bgcolor: "black"  }}/>
            <br/>
            <Typography variant={"h6"}>
                Herausgeber
            </Typography>
            <p style={{textAlign: "start"}}>
                Das WWW-Angebot der Hochschule Weihenstephan-Triesdorf wird im Auftrag des Präsidenten der Hochschule Weihenstephan-Triesdorf veröffentlicht.
            </p>
            <Typography variant={"subtitle1"}>
                <b>Präsident der Hochschule Weihenstephan-Triesdorf</b>
            </Typography>
            <p style={{textAlign: "start"}}>
                Dr. Eric Veulliet<br/>
                T +49 8161 71-3340<br/>
                praesident@hswt.de
            </p>
            <Typography variant={"h6"}>
                Anschrift
            </Typography>
            <p style={{textAlign: "start"}}>
                Hochschule Weihenstephan-Triesdorf<br/>
                Am Hofgarten 4<br/>
                85354 Freising<br/>
                <br/>
                T +49 8161 71-0<br/>
                praesident@hswt.de<br/>
                Internet: www.hswt.de
            </p>
        </div>
    );
}

export default PageImpressum;