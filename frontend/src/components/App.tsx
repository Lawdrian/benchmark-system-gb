import React, {ReactNode, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import PageHelper from "./utils/PageHelper";
import {Page, Section} from "../types/PageConfigTypes";
import {DrawerListItem} from "../types/SharedLayoutTypes";
import AppBasicTheme from "./layout/AppBasicTheme";
import {connect, ConnectedProps, Provider} from "react-redux";
import {AppStore} from "../store";
import {loadUser} from "../actions/auth";
import {LayoutConfig} from "../types/LayoutConfigTypes";


const connector = connect(null, {loadUser});

type ReduxProps = ConnectedProps<typeof connector>

type AppProps = ReduxProps & {
    store: AppStore
    layoutConfig: LayoutConfig
    pageDefinitions: Page[],
    loginPageUrl: string
}

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


const generateIndependentPageRoutes = (pageDef: Page[]): ReactNode => {
    return (
        pageDef
            .filter(page => !page.includeInLayout)
            .map<ReactNode>(page => {
                return (
                    <Route
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

const generateLayoutedPageRoutes = (pageDef: Page[], loginPageUrl: string): ReactNode => {
    return (
        pageDef
            .filter(page => page.includeInLayout)
            .map<ReactNode>(page => {
                return (
                    <Route path={page.urlSnippet} element={
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