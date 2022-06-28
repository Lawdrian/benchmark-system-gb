import React, {ReactNode} from "react";
import {Menu, MenuItem} from "@mui/material";
import Button from "@mui/material/Button";

type GreenhouseMenuProps = {
    greenhouses: string[]
    setIndexCB: (idx: number) => void
    currentIndex: number
}

export const GreenhouseMenu = ({greenhouses, setIndexCB, currentIndex}: GreenhouseMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event: any) => {
        setAnchorEl(null);
        let idx = event.target.value;
        if (idx !== undefined) { // checks if user clicked on valid menu entry
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
        <div>Gewächshaus auswählen:
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
        </div>
    )
}
