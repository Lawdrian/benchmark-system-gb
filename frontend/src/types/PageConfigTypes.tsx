import { ReactNode } from "react";

export enum Section {
    Default,
    Diagrams,
    Profile,
    FurtherReading
}

type DrawerAttributes = {
    readonly linkText?: string
    readonly icon: ReactNode
    readonly section: Section
}

type HeaderAttributes = {
    readonly linkText?: string
    readonly icon: ReactNode
}

type AccountMenuAttributes = {
    readonly linkText?: string
}

type NavigationSlots = {
    readonly drawer?: DrawerAttributes
    readonly header?: HeaderAttributes
    readonly accountMenu?: AccountMenuAttributes
}


export type Page = {
    readonly component: ReactNode
    readonly urlSnippet: string
    readonly includeInLayout: boolean
    readonly headerTitle?: string
    readonly slots: NavigationSlots
}