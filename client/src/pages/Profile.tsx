import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";

const Profile = () => {
  const params = useParams();
  const id = params.id;
  const { data: userProfile, isLoading } = useQuery("profile", () =>
    apiClient.getProfileById(id || "")
  );

  return (
    <div className=" min-h-screen flex justify-center items-center ">
      <div className="w-full flex-col gap-5  flex justify-center items-center">
        <h1>Profile</h1>
        {isLoading && <div>Loading</div>}
        {!userProfile?.avatar && <h1>No Avatar</h1>}
        <img src={userProfile?.avatar} width={"120px"} height={"120px"} />
      </div>
    </div>
  );
};

export default Profile;
