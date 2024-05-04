import { Link, useNavigate } from "react-router-dom";
import * as apiClient from "../api-client";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import QRCode from "qrcode.react";
import { useQuery } from "react-query";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

function Home() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const handleLogOut = () => {
    try {
      apiClient.Logout();
      auth.signOut();
      if (user === undefined) {
        navigate("/login");
      }
    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
  };

  const { data: userProfile } = useQuery(
    "userProfile",
    apiClient.getMyProfile,
    {
      enabled: true,
    }
  );
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-[500px] flex flex-col items-center gap-5  ">
        {user && (
          <QRCode
            value={`${FRONTEND_URL}/profile/${userProfile?._id?.toString()}`}
            renderAs={"svg"}
          />
        )}
        {userProfile && (
          <Link
            className="bg-blue-500 max-content w-fit text-white px-2 py-1 hover:bg-blue-400"
            to={`/profile/${userProfile?._id?.toString()}`}
          >
            Profile
          </Link>
        )}
      </div>
      <button
        onClick={handleLogOut}
        className="fixed bottom-1 right-2 bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 font-medium"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
