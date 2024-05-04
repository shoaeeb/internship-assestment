import { RegisterFormData } from "./pages/Signup";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/signup`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  return responseBody;
};

export const Logout = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/logout`, {
    method: "POST",
    credentials: "include",
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error("Failed to logout user");
  }
  return responseBody;
};

export const Login = async (formData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
  return responseBody;
};

export const LoginByGoogle = async (formData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/login/google`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error("Something went wrong");
  }
  return responseBody;
};

export const getProfileById = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/profile/${id}`, {
    method: "GET",
    credentials: "include",
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error("Failed to get user profile");
  }
  return responseBody;
};

export const getMyProfile = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
    method: "GET",
    credentials: "include",
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error("Failed to get user profile");
  }
  return responseBody;
};
