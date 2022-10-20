import React, {ReactNode} from "react";
import {Grid, Menu, MenuItem} from "@mui/material";
import Button from "@mui/material/Button";

/**
 * @type GreenhouseMenuProps
 *
 * @property {string[]} greenhouses The greenhouses shown in the menu.
 * @property {function} setIndexCB A function to set the index of the active menu entry.
 * @property {number} currentIndex The index of the currently selected menu entry.
 */
type GreenhouseMenuProps = {
    greenhouses: string[]
    setIndexCB: (idx: number) => void
    currentIndex: number
}

/**
 * Defines a React component representing a Drop-down menu for the given greenhouses.
 *
 * @param GreenhouseMenuProps
 * @return JSX.Element
 */
export const GreenhouseMenu = ({greenhouses, setIndexCB, currentIndex}: GreenhouseMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    /**
     * handles the clicking onto the "menu button"
     *
     * @param {React.MouseEvent<HTMLButtonElement>} event event created by the click
     */
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget); // show Dropdown
    };

    /**
     * handles the closing (clicking onto) a menu element
     *
     * @param event event created by the click
     */
    const handleClose = (event: any) => {
        setAnchorEl(null); // hide Dropdown
        let idx = event.target.value;
        // check if user clicked on valid menu entry => if so, set currentIndex
        if (idx !== undefined) {
            setIndexCB(idx);
        }
    }

    const menuItems = greenhouses
        .map<ReactNode>(greenhouse => {
            return (
                <MenuItem onClick={handleClose} value={greenhouses.indexOf(greenhouse)}>
                    {greenhouse}
                </MenuItem>
            );
        })

    return (
        <Grid item container height={1} minHeight={42} xs direction="row" alignItems={"center"} justifyContent={"start"}>
            Gewächshaus auswählen:
                <Button
                    id="greenhouse-button"
                    aria-controls={open ? "greenhouse-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    disabled={greenhouses.length < 2}
                >
                    {greenhouses[currentIndex]}
                </Button>
                <Menu
                    id="greenhouse-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    {menuItems}
                </Menu>
        </Grid>
    )
}
