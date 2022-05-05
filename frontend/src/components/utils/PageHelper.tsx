import React, { FunctionComponent, ReactNode } from "react";
import { useLayoutOutletContext } from "../../helpers/LayoutHelpers";

type PageHelperProps =  {
    children?: ReactNode
    pageTitle?: string
}

const PageHelper: FunctionComponent<PageHelperProps> = (
    {
        children,
        pageTitle
    }
) => {
    useLayoutOutletContext().setTitle(pageTitle);

    return <>{children}</>;
}

export default PageHelper;