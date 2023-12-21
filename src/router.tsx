import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";


export const router = createBrowserRouter([
  {
    path: "/authentication",
    element: <></>,
  },
  {
    path: "/",
    element: <Homepage />,
  },
  {
    path: "/registration",
    element: <></>
  },
]);
