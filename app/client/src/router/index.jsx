import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '~/layouts/DashboardLayout/DashboardLayout'
import SignIn from '~/pages/SignIn'
import AdminRoute from './ProtectedRoute/AdminRoute'
import GuessRoute from './GuessRoute/GuessRoute'
import KnowledgeBase from '~/pages/Dashboard/KnowledgeBase'
import ModelsManager from '~/pages/Dashboard/ModelsManager'
import Setting from '~/pages/Dashboard/Setting'
import DashboardWithSubNavLayout from '~/layouts/DashboardLayout/DashboardWithSubNavLayout'
import KnowledgeBaseConfiguration from '~/pages/Dashboard/KnowledgeBase/KnowledeBaseDetail/Configuration'
import KnowledgeBaseRetrievalTesting from '~/pages/Dashboard/KnowledgeBase/KnowledeBaseDetail/RetrievalTesting'
import UserRoute from './ProtectedRoute/UserRoute'
import MainLayout from '~/layouts/MainLayout'
import UnknowPage from '~/components/Page/UnknowPage'
import UserProfile from '~/pages/User/Profile'
import AdminProfile from '~/pages/Dashboard/Profile'
import HomePage from '~/pages/User/HomePage'
import FeedBack from '~/pages/User/FeedBack'
import FAQs from '~/pages/User/FAQs'
import PublicRoute from './PublicRoute/PublicRoute'
import AppRoute from './AppRoute'
import Register from '~/pages/Register'
import AuthLayout from '~/layouts/AuthLayout'
import AppLayout from '~/layouts/AppLayout'
import VerifyEmail from '~/pages/VerifyEmail';
import Loading from '~/components/Page/Loading'

import Dashboard from '~/pages/Dashboard/Dashboard'
import {ChatGenerator as AdminChat} from '~/pages/Dashboard/ChatGenerator'
import {ChatGenerator as UserChat} from '~/pages/User/ChatGenerator'
import DatasetDetail from  '~/pages/Dashboard/KnowledgeBase/KnowledeBaseDetail/Dataset'
import Datasets from  '~/pages/Dashboard/KnowledgeBase/KnowledeBaseDetail'
import AccountManager from  '~/pages/Dashboard/AccountManager'
import RegisterAA from '~/pages/RegisterAA';
import ForgotPasswords from '~/pages/ForgotPasswords';
import GeneratedPassword from '~/pages/GeneratedPassword';

const subdir = import.meta.env.VITE_SUBDIR

// Define the routes
const router = createBrowserRouter([
  {
    element: <AppRoute> <AppLayout /> </AppRoute>,
    children: [
      {
        element: <GuessRoute><AuthLayout /></GuessRoute>,
        children: [
          {
            path: '/signin',
            element: <SignIn />,
          },
          {
            path: '/register',
            element: <Register />,
          },
          {
            path: '/register/lecturer',
            element: <RegisterAA />,
          },
          {
            path: '/email/verify-email',
            element: <VerifyEmail />,
          },
          {
            path: '/email/request-verification',
            element: <ForgotPasswords />,
          },
          {
            path: '/password/reset-password',
            element: <GeneratedPassword />,
          },
        ],
      },
      {
        element: (<AdminRoute> <DashboardLayout/> </AdminRoute>),
        children: [
          {
            path: '/dashboard',
            element: <Suspense fallback={<Loading/>}><Dashboard /></Suspense>,
          },
          {
            path: '/chat_generator',
            element: <Suspense fallback={<Loading/>}><AdminChat /></Suspense>,
          },
          {
            path: '/knowledge_bases',
            element: <KnowledgeBase/>,
          },
          {
            element: <DashboardWithSubNavLayout/>,
            children: [
              {
                path: '/knowledge_bases/:id/',
                element: <Suspense fallback={<Loading/>}><Datasets/></Suspense>,
              },
              {
                path: '/knowledge_bases/configuration/:id',
                element: <KnowledgeBaseConfiguration/>,
              },
              {
                path: '/knowledge_bases/retrieval_testing/:id',
                element: <KnowledgeBaseRetrievalTesting/>,
              }
            ]
          },
          {
            path: '/knowledge_bases/:collection/:id',
            element:  <Suspense fallback={<Loading/>}><DatasetDetail/></Suspense>,
          },
          {
            path: '/models_manager',
            element: <ModelsManager />,
          },
          {
            path: '/user_accounts',
            element: <Suspense fallback={<Loading/>}><AccountManager /></Suspense>,
          },
          {
            path: '/setting',
            element: <Setting />,
          },
          {
            path: '/admin_profile',
            element: <AdminProfile />,
          },
        ],
      },
      {
        element: (<UserRoute><MainLayout/></UserRoute>),
        children: [
          {
            path: '/chat',
            element: <Suspense fallback={<Loading/>}><UserChat /></Suspense>,
          },
          {
            path: '/user_profile',
            element: <UserProfile />,
          }
        ]
      },
      {
        element: (<PublicRoute><MainLayout/></PublicRoute>),
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/faqs',
            element: <FAQs />,
          },
          {
            path: '/feedback',
            element: <FeedBack />,
          },
        ]
      },
    ]
  },
  {
    path: "*", // Bất kỳ đường dẫn nào không khớp sẽ đi tới trang lỗi
    element: <UnknowPage />,
  },
],
  {
    basename: `/${subdir}`, // 👈 Quan trọng để chạy trong subdir
    future: {
      v7_relativeSplatPath: true, // Enables relative paths in nested routes
      v7_fetcherPersist: true,   // Retains fetcher state during navigation
      v7_normalizeFormMethod: true, // Normalizes form methods (e.g., POST or GET)
      v7_partialHydration: true, // Supports partial hydration for server-side rendering
      v7_skipActionErrorRevalidation: true, // Prevents revalidation when action errors occur
      v7_starttransition: true
    },
  },
);

export default router;
