import React, { ReactNode } from "react";
import { Page, Section } from "../types/PageConfigTypes";

class PageBuilder {

    component: ReactNode;

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
        component: ReactNode,
        urlSnippet: string,
        includeInLayout: boolean
    ) {
        this.component = component;
        this.urlSnippet = urlSnippet;
        this.includeInLayout = includeInLayout;
    }

    withHeaderTitle(
        headerTitle: string
    ): PageBuilder {
        this.headerTitle = headerTitle;

        return this;
    }

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

    includeInHeader(
        icon: ReactNode,
        text: string = 'Default Header Text',
    ): PageBuilder {
        this.headerAttr = {
            linkText: text,
            icon: icon,
        }

        return this;
    }

    includeInAccountMenu(
        text: string = 'Default AccMenu Text',
    ): PageBuilder {
        this.accountMenuAttr = {
            linkText: text,
        }

        return this;
    }

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

export function generatePage(
    component: ReactNode,
    urlSnippet: string,
    includeInLayout: boolean = true
): PageBuilder {
    return new PageBuilder(component, urlSnippet, includeInLayout);
}