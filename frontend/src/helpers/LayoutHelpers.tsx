import { useOutletContext } from "react-router-dom";
import { LayoutOutletContext } from "../types/SharedLayoutTypes";

export function useLayoutOutletContext() {
    return useOutletContext<LayoutOutletContext>()
}