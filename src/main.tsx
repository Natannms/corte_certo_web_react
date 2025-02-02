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
import HaircutScreen from './Screens/Dashboard/HaircutScreen.tsx';
import ProductScreen from './Screens/Dashboard/ProductScreen.tsx';
import BarberShopScreen from './Screens/Dashboard/BarberShopScreen.tsx';
import AcceptInviteColabScreen from './Screens/AcceptInviteColabScreen.tsx';
import BarberShopConfigScreen from './Screens/Dashboard/BarberShopConfigScreen.tsx';
import CTPaymentScreen from './Screens/CTPaymentScreen.tsx';
import AccountScreen from './Screens/Dashboard/AccountScreen.tsx';
import BarberSearchComponentOpenGoogleMaps from '../src/components/BarberSearchComponentOpenGoogleMaps';
import FinancialReport from './Screens/Dashboard/FinancialReport.tsx';
// import BarberSearchInternalMaps from '../src/components/BarberSearchInternalMaps.tsx';


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
    path: "/account",
    element: <AccountScreen />,
  },
  {
    path: "/upgrade-account",
    element: <CTPaymentScreen />,
  },
  {
    path: "/financial-report",
    element: <FinancialReport  />,
  },
  {
    path: "/search-barber-shops",
    element: <BarberSearchComponentOpenGoogleMaps />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/services",
    element: <HaircutScreen />,
  },
  {
    path: "/products",
    element: <ProductScreen />,
  },
  {
    path: "/barber-shop-config",
    element: <BarberShopConfigScreen />,
  },
  {
    path: "/franchise",
    element: <BarberShopScreen />,
  },
  {
    path: "/accept-invite",
    element: <AcceptInviteColabScreen />,
  },
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <RouterProvider router={router} />
  </StrictMode>,
)
