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
        // 🚀 NEW: React Router handles fetching the orders before rendering the component
        loader: async () => {
          const response = await fetch('http://localhost:5000/api/orders');
          if (!response.ok) {
            // Returns an empty array if backend isn't up yet, preventing frontend crashes
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