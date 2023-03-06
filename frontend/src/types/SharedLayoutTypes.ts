/**
 * #############################################################################
 * SharedLayoutTypes.ts: Defines types, which are shared across multiple
 *                        layout components
 * #############################################################################
 */
import {MouseEventHandler, ReactNode} from "react";
import {Section} from "./PageConfigTypes";

export type DrawerListItem = {
    text: string
    icon: ReactNode
    url: string
    section: Section
}

export type DrawerState = {
    open: boolean
    drawerWidth: number
};

export type DrawerControl = {
    toggleDrawer: MouseEventHandler
}

export type SharedDrawerProps = DrawerControl & DrawerState;

export type LayoutOutletContext = {
    setTitle: Function
}

export type LayoutConfig = {
    readonly drawerWidth: number
}