import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase/firebase";
import Profile from "./pages/Profile";

function App() {
  const [user, loading] = useAuthState(auth);
  if (loading) {
    return;
  }

  return (
    <Routes>
      {user === null && <Route path="/" element={<Navigate to="/login" />} />}
      {user && <Route path="/register" element={<Navigate to="/" />} />}
      {user && <Route path="/login" element={<Navigate to="/" />} />}
      {user && <Route path="/" element={<Home />} />}
      <Route path="/profile/:id" element={<Profile />} />
      {user === null && <Route path="/register" element={<Signup />} />}
      {user == null && <Route path="/login" element={<Login />} />}
    </Routes>
  );
}

export default App;
