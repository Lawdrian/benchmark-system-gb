/**
 * #############################################################################
 * hooks.ts: Defines typed hooks for usage with react redux
 * #############################################################################
 */
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"
import type {AppDispatch, RootState} from "../store";

/**
 * Set up custom typed redux hooks like described in:
 * https://redux.js.org/usage/usage-with-typescript#define-typed-hooks
 */

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector