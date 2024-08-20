import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LPScreen from './Screens/LPScreen.tsx';
import RegisterScreen from './Screens/RegisterScreen.tsx';
import LoginScreen from './Screens/LoginScreen.tsx';
import Dashboard from './Screens/Dashboard/index.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LPScreen />,
  },
  {
    path: "/app",
    element: <App />,
  },
  {
    path: "/register",
    element: <RegisterScreen />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <RouterProvider router={router} />
  </StrictMode>,
)
