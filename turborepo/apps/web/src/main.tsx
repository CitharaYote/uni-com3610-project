import React from "react";
import ReactDOM from "react-dom/client";
import { Router, Routes, Route, BrowserRouter } from "react-router-dom";
import "./index.css";

// Pages
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import RequireAuth from "./components/auth/RequireAuth.tsx";

// Redux
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Welcome from "./components/auth/Welcome.tsx";
import Register from "./pages/Register.tsx";
import Logout from "./pages/Logout.tsx";
import Users from "./pages/Users.tsx";
import Unauthorised from "./pages/Unauthorised.tsx";
import Staff from "./pages/Staff.tsx";
import Admin from "./pages/Admin.tsx";
import BrowseListings from "./pages/BrowseListings.tsx";
import Profile from "./pages/Profile.tsx";
import SearchListings from "./pages/SearchListings.tsx";
import SavedListings from "./pages/SavedListings.tsx";
import { ErrorProvider } from "./components/common/ErrorDisplay.tsx";
import StaffSearchListings from "./pages/StaffSearchListings.tsx";
import Applications from "./pages/Applications.tsx";

// const router = createBrowserRouter([
//   // public routes
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "/auth/login",
//     element: <Login />,
//   },
//   // private routes
//   {
//     path: "/profile",
//     element: <RequireAuth />,
//   },
//   {
//     path: "/auth/logout",
//     element: <RequireAuth />,
//   },
// ]);

// staff roles:
// - normal user: 2001
// - staff: 1984
// - admin: 5150

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ErrorProvider>
            <Routes>
              <Route path="/" element={<BrowseListings />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/logout" element={<Logout />} />
              <Route path="/listings/recent" element={<BrowseListings />} />
              <Route path="/listings/search" element={<SearchListings />} />
              <Route
                path="/listings/saved"
                element={
                  <RequireAuth>
                    <SavedListings />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route
                path="/applications"
                element={
                  <RequireAuth>
                    <Applications />
                  </RequireAuth>
                }
              />
              <Route
                path="/users"
                element={
                  <RequireAuth requiredRoles={[5150]}>
                    <Users />
                  </RequireAuth>
                }
              />
              <Route
                path="/staff"
                element={
                  <RequireAuth requiredRoles={[1984]}>
                    <Staff />
                  </RequireAuth>
                }
              />
              <Route
                path="/staff/listings/search"
                element={
                  <RequireAuth requiredRoles={[1984]}>
                    <StaffSearchListings />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireAuth requiredRoles={[5150]}>
                    <Admin />
                  </RequireAuth>
                }
              />
              <Route path="/unauthorised" element={<Unauthorised />} />
            </Routes>
          </ErrorProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
