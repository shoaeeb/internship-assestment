import { useForm } from "react-hook-form";
import usePreviewImg from "../hooks/usePreviewImg";
import React, { useRef, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, provider } from "../firebase/firebase";
import { signInWithPopup } from "firebase/auth";
import * as apiClient from "../api-client";
import { Link } from "react-router-dom";

export type RegisterFormData = {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmpassword: string;
  gender: string;
  admin: boolean;
  avatar: string;
};

const Signup = () => {
  const [open, setOpen] = useState(false);
  const { previewImg, handlePreviewImg } = usePreviewImg();
  const imgRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<RegisterFormData>({
    defaultValues: {
      avatar: previewImg,
    },
  });

  const registerUsingGoogle = () => {
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

  const onSubmit = handleSubmit(async (formData: RegisterFormData) => {
    if (loading) return;
    try {
      setLoading(true);
      const fireBaseResponse = await createUserWithEmailAndPassword(
        formData.email,
        formData.password
      );
      const user = fireBaseResponse?.user;
      console.log(user);
      if (!user) {
        return;
      }
      const uuid = user.uid;
      apiClient.Register({ ...formData, uuid, avatar: previewImg });
    } catch (error: any) {
      console.log(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div
      className=" min-h-screen bg-cover bg-no-repeat flex justify-center items-center"
      style={{
        backgroundImage: `url(
            https://images.unsplash.com/photo-1658065179831-1a1f05f9315a?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D
            )`,
      }}
    >
      <div className="border background-blur-md w-[500px] ">
        <h1 className="text-white text-center text-xl">Sign Up</h1>
        {open && (
          <div className="w-full flex justify-center items-center ">
            <img
              className="inline-block h-11 w-11 rounded-full ring-2 ring-white"
              onClick={() => {
                if (!imgRef?.current) {
                  return;
                }
                imgRef?.current?.click();
              }}
              src={
                previewImg ||
                "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
            />
            <input
              onChange={handlePreviewImg}
              ref={imgRef}
              hidden
              type="file"
            />
          </div>
        )}
        {open && (
          <form
            onSubmit={(e: React.ChangeEvent<HTMLFormElement>) => {
              e.preventDefault();
              onSubmit();
            }}
            className="px-5 py-2 font-medium text-white flex flex-col gap-5"
          >
            <label className="w-full">
              First Name:
              <input
                type="text"
                placeholder="Enter your first name"
                className="bg-transparent border-b border-b-slate-50 px-2 py-1 w-full focus:outline-none"
                {...register("firstName", {
                  required: "This field is required",
                })}
              />
              {errors.firstName && (
                <p className="text-red-500">{errors.firstName.message}</p>
              )}
            </label>
            <label className="w-full">
              Last Name:
              <input
                type="text"
                placeholder="Enter your Last Name"
                className="bg-transparent border-b border-b-slate-50 px-2 py-1 w-full focus:outline-none"
                {...register("lastName", {
                  required: "This field is required",
                })}
              />
              {errors.lastName && (
                <p className="text-red-500">{errors.lastName.message}</p>
              )}
            </label>
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
              UserName:
              <input
                type="text"
                placeholder="Enter your Username"
                className="bg-transparent border-b border-b-slate-50 px-2 py-1 w-full focus:outline-none"
                {...register("username", {
                  required: "This field is required",
                })}
              />
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
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
            <label className="w-full">
              Confirm Password:
              <input
                type="password"
                placeholder="confirm password"
                className="bg-transparent border-b border-b-slate-50 px-2 py-1 w-full focus:outline-none"
                {...register("confirmpassword", {
                  validate: (val: string) => {
                    if (!val) {
                      return "This field is required";
                    }
                    if (val !== watch("password")) {
                      return "Password does not match";
                    }
                  },
                })}
              />
              {errors.confirmpassword && (
                <p className="text-red-500">{errors.confirmpassword.message}</p>
              )}
            </label>

            <label className="w-full">
              Admin:
              <select
                className="bg-transparent text-black border-b border-b-slate-50 px-2 py-1  focus:outline-none"
                value={watch("admin") ? "Yes" : "No"}
                {...register("admin", {
                  required: "This field is required",
                })}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              {errors.admin && (
                <p className="text-red-500">{errors.admin.message}</p>
              )}
            </label>
            <div className="w-full flex justify-end ">
              <button
                disabled={loading}
                className="px-2 py-1 border border-slate-50 hover:border-slate-500"
              >
                {loading ? "Signing up..." : "Sign Up"}
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
            Sign Up With Email
          </div>
        )}
        {!open && (
          <div
            onClick={registerUsingGoogle}
            className=" bg-[crimson] text-white rounded-md w-full   text-center px-5 py-1"
          >
            Sign Up With Google
          </div>
        )}
        <p className="text-center font-semibold text-white">
          Don't have a account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
