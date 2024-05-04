import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, provider } from "../firebase/firebase";
import * as apiClient from "../api-client";
import { signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";

export type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormData>();

  const [open, setOpen] = useState<boolean>(false);
  const [signInWithEmailAndPassword, , loading] =
    useSignInWithEmailAndPassword(auth);

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        const formData = {
          email: user.providerData[0].email,
          firstName: user.providerData[0].displayName?.split(" ")[0],
          lastName: user.providerData[0].displayName?.split(" ")[1],
          uuid: user.uid,
          username: user.providerData[0].displayName,
          admin: false,
          gender: "male",
          avatar: user.providerData[0].photoURL,
        };
        apiClient.LoginByGoogle(formData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSubmit = handleSubmit(async (formData: LoginFormData) => {
    try {
      const firebaseResponse = await signInWithEmailAndPassword(
        formData.email,
        formData.password
      );
      const user = firebaseResponse?.user;
      if (!user) return;
      const uuid = user.uid;
      apiClient.Login({ ...formData, uuid });
    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
  });

  return (
    <div>
      <div
        className=" min-h-screen bg-cover bg-no-repeat flex justify-center items-center"
        style={{
          backgroundImage: `url(
            https://images.unsplash.com/photo-1658065179831-1a1f05f9315a?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
            )`,
        }}
      >
        <div className="border px-2 py-1 background-blur-md w-[500px] ">
          <h1 className="text-white text-center text-xl">Login </h1>

          {open && (
            <form
              onSubmit={(e: React.ChangeEvent<HTMLFormElement>) => {
                e.preventDefault();
                onSubmit();
              }}
              className="px-5 py-2 font-medium text-white flex flex-col gap-5"
            >
              <label className="w-full">
                Email:
                <input
                  type="text"
                  placeholder="Enter your Email"
                  className="bg-transparent border-b border-b-slate-50 px-2 py-1 w-full focus:outline-none"
                  {...register("email", {
                    required: "This field is required",
                  })}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </label>

              <label className="w-full">
                Password:
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="bg-transparent border-b border-b-slate-50 px-2 py-1 w-full focus:outline-none"
                  {...register("password", {
                    required: "This field is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </label>

              <div className="w-full flex justify-end ">
                <button
                  disabled={loading}
                  className="px-2 py-1 border border-slate-50 hover:border-slate-500"
                >
                  {loading ? "Submitting" : "Submit"}
                </button>
              </div>
            </form>
          )}
          {!open && (
            <div
              className="w-full rounded-md text-white mb-5 bg-blue-500 opacity-0.5 border text-center border-slate-500 px-5 py-1"
              onClick={() => {
                setOpen(true);
              }}
            >
              Sign In With Email
            </div>
          )}
          {!open && (
            <div
              onClick={loginWithGoogle}
              className=" bg-[crimson] text-white rounded-md w-full   text-center px-5 py-1"
            >
              Sign In With Google
            </div>
          )}
          <p className="text-center font-semibold text-white">
            Don't have a account? <Link to="/register">register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
