"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { EyeOff, Eye } from "lucide-react";
import { Input } from "@/components/ui/input"; 
const LoginPage = () => {
  const router = useRouter();
  const signUp = () => router.push("/signUp");
  const [user, setUser] = useState({ email: "", password: "" });
  const [isShow, setIsShow] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };
  const showPassword = () => setIsShow(!isShow);
  const login = async () => {
    try {
      const response = await axios.post("http://localhost:3030/user/login", user);
      localStorage.setItem("token", response.data.token);
      router.push("/");
    } catch (error) {
 
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response?.data;
        setErrorMessages([errorResponse?.message || "An error occurred during login."]);
      } else {
        setErrorMessages(["An unexpected error occurred."]);
      }
    }
  }
  const isFormValid = user.email.length && user.password.length;
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 text-gray-900">
    <div className="relative z-10 p-8 bg-white rounded-lg shadow-lg w-96">
      <h2 className="text-3xl font-semibold text-center mb-6">Welcome Back!</h2>
      <p className="text-sm text-center mb-6">Log in to enjoy your favorite dishes.</p>
      <Input
        type="email"
        name="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        value={user.email}
        onChange={handleChange}
        
      />
      <div className="relative mb-6">
        <Input
          type={isShow ? "text" : "password"}
          name="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          value={user.password}
          onChange={handleChange}
        />
        <div
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={showPassword}
        >
          {isShow ? <Eye className="text-gray-600" /> : <EyeOff className="text-gray-600" />}
        </div>
      </div>
  
      <p className="text-sm text-center mb-6">
        or <span className="font-semibold text-blue-600 cursor-pointer" onClick={signUp}>Sign up</span>
      </p>
      <button
        className={`w-full py-2 text-white rounded-md transition duration-300 ${isFormValid ? 'bg-black hover:bg-gray-700' : 'bg-gray-400 cursor-not-allowed'}`}
        onClick={login}
        disabled={!isFormValid}
      >
        Log in
      </button>
  
      {/* Error Messages */}
      {errorMessages.length > 0 && (
        <div className="mt-4 text-red-500 text-center">
          {errorMessages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      )}
    </div>
  </div>
  
  );
};

export default LoginPage;
