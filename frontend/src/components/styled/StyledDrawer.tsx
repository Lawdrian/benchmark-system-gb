import React from "react";
import { DrawerProps } from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import { DrawerState } from "../../types/SharedLayoutTypes";

type StyledDrawerProps = DrawerProps & DrawerState

/**
 * This component renders the animated transition, when clicking on the burger icon on the header.
 */
const StyledDrawer = styled(
      MuiDrawer,
      { shouldForwardProp: (prop) => prop !== 'open',}
)
    <StyledDrawerProps>(({ theme, open, drawerWidth }) => ({
      '& .MuiDrawer-paper': {
          position: 'relative',
          whiteSpace: 'nowrap',
          width: drawerWidth,
          transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: 'border-box',
          ...(!open && {
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.leavingScreen,
              }),
              width: theme.spacing(7),
              [theme.breakpoints.up('sm')]: {
                  width: theme.spacing(9),
              },
          }),
      },
}));

export default StyledDrawer;