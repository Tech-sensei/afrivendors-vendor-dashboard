import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Typed versions of useDispatch and useSelector — use these throughout the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
