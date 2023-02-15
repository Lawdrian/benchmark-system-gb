import React, { FunctionComponent, ReactNode } from "react";
import { Link } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import StyledDrawer from "../styled/StyledDrawer";
import { DrawerListItem, SharedDrawerProps } from "../../types/SharedLayoutTypes";
import { Section } from "../../types/PageConfigTypes";
import Logo from "../../assets/app_drawer_logo.png"

type DrawerProps = SharedDrawerProps & {
    listItems: DrawerListItem[]
}

const generateNodes = (listItems: DrawerListItem[]): ReactNode => {
    return listItems.map<ReactNode>(listItem => {
       return (
           <ListItemButton key={listItem.url} to={listItem.url} component={Link}>
               <ListItemIcon>
                   { listItem.icon }
               </ListItemIcon>
               <ListItemText primary={listItem.text} />
           </ListItemButton>
       );
    });
}

const getSectionDivider = (): ReactNode => {
    return (<Divider sx={{ my: 1 }} />);
}

/**
 * This component renders the app drawer seen on the left side of the website. It contains all buttons that lead to
 * the different pages of the web application.
 *
 * @param open - Boolean if the app drawer should be visible or not
 * @param toggleDrawer - Function that will be called, when the icon button at the top of the drawer is clicked
 * @param drawerWidth - Determines the width of the drawer
 * @param listItems - List, that contains the Buttons that lead to different pages of the web application
 */
const AppDrawer = (
    {
        open,
        toggleDrawer,
        drawerWidth,
        listItems
    }: DrawerProps
) => {
    const homeSection = listItems.filter(item => item.section == Section.Home);
    const inputSection = listItems.filter(item => item.section == Section.Input);
    const diagramSection = listItems.filter(item => item.section == Section.Diagrams);
    const profileSection = listItems.filter(item => item.section == Section.Profile);
    const fReadingSection = listItems.filter(item => item.section == Section.FurtherReading);

    return (
        <StyledDrawer variant="permanent" open={open} drawerWidth={drawerWidth}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'start',
                    justifyContent: 'flex-end',
                    px: [1],
                    ml: 4,
                    mb: 1,
                    mt: 1
                }}
            >
                <img src={Logo} alt="Website logo"/>
                <IconButton onClick={toggleDrawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
                {generateNodes(homeSection)}
                {homeSection.length && diagramSection.length ? getSectionDivider() : undefined}
                {generateNodes(inputSection)}
                {inputSection.length && diagramSection.length ? getSectionDivider() : undefined}
                {generateNodes(diagramSection)}
                {diagramSection.length && profileSection.length ? getSectionDivider() : undefined}
                {generateNodes(profileSection)}
                {profileSection.length && fReadingSection.length ? getSectionDivider() : undefined}
                {generateNodes(fReadingSection)}
            </List>
        </StyledDrawer>
    );
}

export default AppDrawer