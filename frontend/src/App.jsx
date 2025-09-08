import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { authUser } = useAuthContext();

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Navigate to="/main" /> : <Navigate to="/main/login" />}
        />
        <Route
          path="/main"
          element={authUser ? <Home /> : <Navigate to="/main/login" />}
        />
        <Route
          path="/main/login"
          element={authUser ? <Navigate to="/main" /> : <Login />}
        />
        <Route
          path="/main/signup"
          element={authUser ? <Navigate to="/main" /> : <Signup />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
