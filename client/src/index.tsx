import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.scss'
import Creation from './routes/creation'
import Home from './routes/home'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/creation",
    element: <Creation />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);