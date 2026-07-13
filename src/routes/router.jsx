import { createBrowserRouter } from "react-router-dom";
import RootLayOut from "../Layouts/RootLayOut";

import LoginPage from "../pages/Auth/Login/LoginPage";
import RegisterPage from "../pages/Auth/Register/RegisterPage";
import AdminDashboard from "../pages/Dashboard/AdminDashboard";
import BasketPage from "../pages/Features/basket/BasketPage";
import CheckoutPage from "../pages/Features/childCard/CheckoutPage";
import FeatureCard from "../pages/Features/childCard/FeatureCard";
import OrdersPage from "../pages/Features/OrdersPage";
import ShopPage from "../pages/Features/ShopPage";
import Home from "../pages/Main home/Home";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import TrackOrder from "../pages/trakcer/TrackOrder";


const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : 'http://localhost:5000';

export const router = createBrowserRouter([
  { 
    path: "/",
    Component: RootLayOut,
    children: [
      {
        index: true,
        loader: () => fetch('featured.json'), 
        Component: Home,
      },
      {
        path: 'feature/:id',
        Component: FeatureCard,
      },
      {
        path: 'product/:id',
        Component: ProductDetails,
      },
      {
        path: 'admin/dashboard',
        Component: AdminDashboard,
      },
      {
        path: 'shop',
        Component: ShopPage,
      },
      {
        path: 'login',
        Component: LoginPage
      },
      {
        path: 'register',
        Component: RegisterPage
      },
      {
        path: 'orders',
        
        loader: async () => {
          const response = await fetch(`${API_BASE_URL}/api/orders`);
          if (!response.ok) {
            
            return []; 
          }
          return response.json();
        },
        Component: OrdersPage
      },
      {
        path: 'basket',
        Component: BasketPage
      },
      {
        path: 'checkout',
        Component: CheckoutPage
      },
      {
        path:'track/:orderId',
        Component: TrackOrder
      },
      {
        path:'admin',
        Component:AdminDashboard
      }
    ]
  }
]);