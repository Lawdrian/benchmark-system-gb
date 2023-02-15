import React, {ReactNode, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import PageHelper from "./utils/PageHelper";
import {Page, Section} from "../types/PageConfigTypes";
import {DrawerListItem, LayoutConfig} from "../types/SharedLayoutTypes";
import AppBasicTheme from "./layout/AppBasicTheme";
import {connect, ConnectedProps, Provider} from "react-redux";
import {AppStore} from "../store";
import {loadUser} from "../actions/auth";

const connector = connect(null, {loadUser});

type ReduxProps = ConnectedProps<typeof connector>

type AppProps = ReduxProps & {
    store: AppStore
    layoutConfig: LayoutConfig
    pageDefinitions: Page[],
    loginPageUrl: string
}

/**
 * This is the main component of the web application. It renders all pages under different routes.
 * @param store - Redux store
 * @param layoutConfig - Config for the layout
 * @param pageDefinitions - Pages that should be rendered with a specific route
 * @param loginPageUrl - Slug of the login page
 * @param loadUser - Function that loads the user from the back end
 */
const App = ({store, layoutConfig, pageDefinitions, loginPageUrl, loadUser}: AppProps) => {
    loadUser()

    useEffect(() => {
       loadUser()
    });

    const homepage = getHomepage(pageDefinitions);

    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    {generateIndependentPageRoutes(pageDefinitions)}
                    <Route path="/" element={<AppLayout config={layoutConfig}
                                                        drawerItems={generateDrawerItems(pageDefinitions)}/>}>
                        {<Route index
                                element={<PageHelper
                                    pageTitle={homepage?.headerTitle}
                                    loginUrl={loginPageUrl}
                                    isPrivate={true}>{homepage?.component}</PageHelper>}/>}
                        {generateLayoutedPageRoutes(pageDefinitions, loginPageUrl)}
                    </Route>
                </Routes>
            </Router>
        </Provider>
    );
}

/**
 * This function generates the pages that should not be included in the drawer menu and don't have the layout.
 * @param pageDef - List of pages
 */
const generateIndependentPageRoutes = (pageDef: Page[]): ReactNode => {
    return (
        pageDef
            .filter(page => !page.includeInLayout)
            .map<ReactNode>(page => {
                return (
                    <Route
                        key={page.urlSnippet}
                        path={page.urlSnippet}
                        element={
                            <AppBasicTheme>
                                {page.component}
                            </AppBasicTheme>
                        }
                    />
                );
            })
    );
};

/**
 * This function generates the pages that should contain the layout of the website
 * @param pageDef - List of pages
 * @param loginPageUrl - The url slug of the login page
 */
const generateLayoutedPageRoutes = (pageDef: Page[], loginPageUrl: string): ReactNode => {
    return (
        pageDef
            .filter(page => page.includeInLayout)
            .map<ReactNode>(page => {
                return (
                    <Route key={page.urlSnippet} path={page.urlSnippet} element={
                        <PageHelper
                            pageTitle={page.headerTitle ? page.headerTitle : 'header title undefined'}
                            isPrivate={true}
                            loginUrl={loginPageUrl}
                        >
                            {page.component}
                        </PageHelper>
                    }/>
                );
            })
    );
};


const generateDrawerItems = (pageConfig: Page[]): DrawerListItem[] => {
    return (
        pageConfig
            .filter(page => page.slots.drawer !== undefined)
            .map<DrawerListItem>(page => {
                let drawerSlot = page.slots.drawer;
                let linkText = drawerSlot?.linkText;
                let drawerIcon = drawerSlot?.icon;
                let section = drawerSlot?.section;
                let urlSnippet = page.urlSnippet;

                return {
                    text: linkText ? linkText : "undefined link text",
                    icon: drawerIcon,
                    url: urlSnippet,
                    section: section ? section : Section.Default
                }
            })
    )
}


const getHomepage = (pageConfig: Page[]) => {
    const homePage = pageConfig.filter(page => page.urlSnippet == "/")
    if (homePage.length > 0)
        return homePage[0]
    else {
        return null
    }
}

export default connector(App);