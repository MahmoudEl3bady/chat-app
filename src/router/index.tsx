import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
 const router =  createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<Home  />} />
            <Route path="/login" element={<Login />} />
        </>
    )
)



export default router;