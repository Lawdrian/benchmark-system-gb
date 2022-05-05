import React, { FunctionComponent, ReactNode } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import PageHelper from "./utils/PageHelper";
import layoutConfig from "../configuration/LayoutConfig";
import pageConfig from "../configuration/PageConfig";
import { Page, Section } from "../types/PageConfigTypes";
import { DrawerListItem } from "../types/SharedLayoutTypes";

type AppProps = {

}

const generateIndependentPageRoutes = (pageConfig: Page[]): ReactNode => {
    return (
        pageConfig
            .filter(page => !page.includeInLayout)
            .map<ReactNode>(page => {
                return <Route
                    path={page.urlSnippet}
                    element={page.component}
                />
            })
    );
};

const generateLayoutedPageRoutes = (pageConfig: Page[]): ReactNode => {
    return (
        pageConfig
            .filter(page => page.includeInLayout)
            .map<ReactNode>(page => {
                return <Route
                    path={page.urlSnippet}
                    element={
                        <PageHelper
                            pageTitle={page.headerTitle ? page.headerTitle : 'header title undefined'}
                        >
                            {page.component}
                        </PageHelper>
                    }
                />
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

const App: FunctionComponent<AppProps> = (props: AppProps) => {

    return (
      <Router>
          <Routes>
              {generateIndependentPageRoutes(pageConfig)}
              <Route
                  path=""
                  element={
                      <AppLayout
                          config={layoutConfig}
                          drawerItems={generateDrawerItems(pageConfig)}
                      />
                  }
              >
                {generateLayoutedPageRoutes(pageConfig)}
              </Route>
          </Routes>
      </Router>
    );
}

export default App;