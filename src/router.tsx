import { createBrowserRouter } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Registration from "./pages/Registration";
import Authentication from "./pages/Authentication";


export const router = createBrowserRouter([
  {
    path: "/authentication",
    element: <></>,
  },
  {
    path: "/",
    element: <Authentication />,
  },
  {
    path: "/registration",
    element: <></>
  },
  {
    path: "/estimateAge",
    element: <></>
  }
]);
