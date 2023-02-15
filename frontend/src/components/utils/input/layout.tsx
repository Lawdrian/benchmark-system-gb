import react from "react"
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React from "react";
import {Divider} from "@mui/material";

/**
 * This component is used to divide input fields on the same input page.
 *
 * @param {@link DynamicInputField} props - This Type contains the title for the divider
 * @return {ReactNode} One SectionDivider component.
 */
export const SectionDivider = (props: {title: string}) => {

    return(
         <Grid container item direction="column" xs={12} sx={{marginTop:5}}>
             <Typography variant="h4"> {props.title} </Typography>
             <Divider sx={{ borderBottomWidth: 3, bgcolor: "black"  }}/>
         </Grid>


    )


}