// src/router/index.tsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
         </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
    </>
  )
);

export default router;
