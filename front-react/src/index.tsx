import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
import Error404 from "./pages/wrapper/Error404";
import Root from "./pages/wrapper/Root";
import { Provider } from 'react-redux';
import {store} from './redux/Store';
import ProtectedRoute from "./pages/wrapper/ProtectedRoute";
import SignUp from "./pages/SignUp";
import Chat from "./pages/Chat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/chat",
        element: <Chat/>,
      },
    ],
  },
  {
    path: "/",
    element: <Root/>,
    errorElement: <Error404 />,
    children: [
      {
        path: "/login",
        element: <Login/>,
      },
      {
        path: "/sign-up",
        element: <SignUp/>,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
