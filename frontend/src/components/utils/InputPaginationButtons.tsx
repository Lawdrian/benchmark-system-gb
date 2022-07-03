import React from 'react'
import Button from "@mui/material/Button";
import {NavigateBefore, NavigateNext} from "@mui/icons-material";
import {Box} from "@mui/material";
import { useNavigate } from "react-router-dom";

export type InputPaginationButtonsProps = {
    hasPrevious: () => boolean
    hasNext: () => boolean
    previous: Function
    next: Function
    submit: Function

}

/**
 * Contains 2 buttons that are used to navigate the tabs on the input data page.
 * On the last tab there will be a submit button that can be used to submit the user data.
 * The user will be redirected to the plotting page
 *
 * @param {InputPaginationButtonsProps} props This Type contains 5 functions that are used to change the current tab and submit the data
 * @return {ReactNode} 2 Buttons to change the current tab. On the last page the next button changes to a submission button.
 */
const InputPaginationButtons = (props:InputPaginationButtonsProps) => {
    let navigate = useNavigate();

    return (
            <Box sx={{display:"flex", justifyContent:"center"}} >
                <>
                <Button
                    size="large"
                    disabled={!props.hasPrevious()}
                    startIcon={<NavigateBefore />}
                    onClick={() => props.previous()}
                >
                    Zurück
                </Button>
                {props.hasNext()
                    ?
                    <Button
                        sx={{ml: 2}}
                        size="large"
                        disabled={!props.hasNext()}
                        endIcon={<NavigateNext/>}
                        onClick={() => props.next()}
                    >
                        Weiter
                    </Button>
                    :
                    <Button
                        sx={{ml: 2}}
                        size="large"
                        disabled={false}
                        endIcon={<NavigateNext/>}
                        onClick={() =>
                            {
                                navigate("../co2-footprint")
                                props.submit()
                            }
                        }
                    >
                        Abschicken
                    </Button>

                    }
                </>
            </Box>
       )
}
export default InputPaginationButtons