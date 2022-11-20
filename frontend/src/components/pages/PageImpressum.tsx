import React from "react";
import {Typography} from "@mui/material";

type ImpressumProps = {

}

const PageImpressum = (props: ImpressumProps) => {
    return (
        <div id="login" className="page">
            <Typography variant={"h5"}>
                Impressum
            </Typography>
            <p style={{textAlign: "start"}}>
                Benchmark Tool<br/>
                Hauptstraße 1<br/>
                50667 Köln<br/>
                Fon: +49 (0) 221 - 12 34 56 - 0<br/>
                Fax: +49 (0) 221 - 12 34 56 - 1<br/>
                E-Mail: info@benchmark-tool.de<br/>
                Web: http://www.benchmark-tool.de<br/>
                ---------------------------------------------------------------------------<br/>
                Benchmark Tool e.V.<br/>
                Geschäftsführer: Max Mustermann<br/>
                Vorstand: Dr. jur. Stefanie Musterfrau(Vorsitzende), Heinz Muster (stv. Vorsitzender), Markus Beispiel, Stefan Example,<br/>
                Beatrice Beispielhaft Vereinsregister: Amtsgericht Köln, VR 123456 Sitz des Vereins: Köln
            </p>
        </div>
    );
}

export default PageImpressum;