import React, {ReactNode} from "react";
import {Page, Section} from "../types/PageConfigTypes";

/**
 * @class PageBuilder
 *
 * Helper class to build an objcet of type Page out of various parameters.
 *
 * @property {JSX.Element} component - A component holding the pages content
 * @property {string} urlSnippet - The url that leads to the page
 * @property {boolean} includeInLayout - Specify, whether wrapp the page in an AppLayout or not
 * @property {string} headerTitle - The title of the AppLayout header
 * @property drawerAttr - Attributes to display a page link in the AppLayout drawer
 * @property headerAttr - Currently unused
 * @property accountMenuAttr - Currently unused
 */
class PageBuilder {

    component: JSX.Element;

    urlSnippet: string;

    includeInLayout: boolean;

    headerTitle?: string;

    drawerAttr?: {
        icon: ReactNode,
        linkText: string,
        section: Section
    };

    headerAttr?: {
        icon: ReactNode,
        linkText: string
    };

    accountMenuAttr?: {
        linkText: string
    };

    constructor(
        component: JSX.Element,
        urlSnippet: string,
        includeInLayout: boolean
    ) {
        this.component = component;
        this.urlSnippet = urlSnippet;
        this.includeInLayout = includeInLayout;
    }

    /**
     * Specify the AppLayout header title of the page.
     *
     * @param headerTitle - The header title to use
     */
    withHeaderTitle(
        headerTitle: string
    ): PageBuilder {
        this.headerTitle = headerTitle;

        return this;
    }

    /**
     * Specify to include the page in the drawer-panel of the AppLayout
     *
     * @param icon - The icon to use
     * @param text - The link text
     * @param section - The section, where the link will be positioned
     */
    includeInDrawer(
        icon: ReactNode,
        text: string = 'Default Drawer Text',
        section: Section = Section.Diagrams
    ): PageBuilder {
        this.drawerAttr = {
            linkText: text,
            icon: icon,
            section: section
        }

        return this;
    }


    /**
     * Generates the final page object from this PageBuilder instance
     */
    finalize(): Page {
        let slots = {
            drawer: this.drawerAttr,
            header: this.headerAttr,
            accountMenu: this.accountMenuAttr
        }
        return {
            component: this.component,
            urlSnippet: this.urlSnippet,
            includeInLayout: this.includeInLayout,
            headerTitle: this.headerTitle,
            slots: slots
        };
    }
}

/**
 * Initialize a new PageBuilder.
 *
 * @param component - The page component to use
 * @param urlSnippet - The page url
 * @param includeInLayout - True, if the page should be wrapped in an AppLayout component
 */
export function generatePage(
    component: JSX.Element,
    urlSnippet: string,
    includeInLayout: boolean = true
): PageBuilder {
    return new PageBuilder(component, urlSnippet, includeInLayout);
}