import React from "react";
import { AppBarProps } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { DrawerState } from "../../types/SharedLayoutTypes";

type StyledAppBarProps = AppBarProps & DrawerState & {

}

/**
 * This component renders the animated transition, when clicking on the '>' icon on the expanded app bar.
 */
const StyledAppBar = styled(
      MuiAppBar,
      { shouldForwardProp: (prop) => prop !== 'open',}
)<StyledAppBarProps>(({ theme, open, drawerWidth }) => ({
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      ...(open && {
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }),
}));

export default StyledAppBar;