import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from "./LoginRegister/Login";
import Register from "./LoginRegister/Register"
import Homepage from "./LoginRegister/Homepage"
import ShowAllData from './Managedata/ShowAllData';
import UserProfile from './Managedata/Profile';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/homepage",
    element: <Homepage/>
  },{
    path: "/alldatatrade",
    element : <ShowAllData/>
  }, 
  {
    path : "/profile",
    element : <UserProfile/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);