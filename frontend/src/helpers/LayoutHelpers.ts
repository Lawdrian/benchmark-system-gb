import {useOutletContext} from "react-router-dom";
import {LayoutOutletContext} from "../types/SharedLayoutTypes";

/**
 * Custom outlet context hook for the AppLayout component.
 *
 * See also: https://reactrouter.com/docs/en/v6/hooks/use-outlet-context
 */
export function useLayoutOutletContext() {
    return useOutletContext<LayoutOutletContext>()
}

export const CO2 = "CO\u2082"
export const H2O = "H\u2082O"