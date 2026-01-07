import React, { useState } from "react";
import { FaHashtag, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../api/auth";
import { toast } from "sonner";
import type { AuthRequest } from "../../../interfaces/auth/AuthRequest";
import { useAuthStore } from "../../../store/auth_store";

const LoginForm = () => {
  const [studentId, setStudentId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authRequest: AuthRequest = {
        studentId,
        password,
      };

      await login(authRequest);

      const { accessToken, user } = useAuthStore.getState();

      console.log(`USER AFTER LOGIN:`, user);

      if (!accessToken || !user) {
        throw new Error("Auth state not ready");
      }

      let destination = "";

      if (user.role === "ADMIN") destination = "/admin/dashboard";
      else destination = "/dashboard";

      toast.success("Login successful");
      navigate(destination);
    } catch (error: any) {
      console.error("Login failed:", error);

      if (error?.response?.status === 401) {
        toast.error("Invalid credentials. Please check your ID and password.");
      } else {
        toast.error("Login failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      action=""
      method="post"
      className="space-y-5 w-full py-6 sm:py-10 z-10"
      onSubmit={handleSubmit}
    >
      <div className="w-full relative">
        <label htmlFor="idNumber" className="absolute top-5 left-3">
          <FaHashtag className="text-lg sm:text-xl text-purple-300/80" />
        </label>
        <input
          type="text"
          id="idNumber"
          className="w-full bg-purple-700/40 rounded-2xl  py-3 sm:py-4  px-10  text-white  placeholder-purple-300/80  focus:outline-none  focus:bg-purple-700/50  transition-all shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] z-10 border border-black  font-bold text-base sm:text-lg lg:text-xl"
          placeholder="ID Number"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
      </div>
      <div className="w-full relative">
        <label htmlFor="password" className="absolute top-5 left-3">
          <FaLock className="text-lg sm:text-xl text-purple-300/80" />
        </label>
        <input
          type="password"
          id="password"
          className="w-full bg-purple-700/40 rounded-2xl  py-3 sm:py-4 px-10  text-white  placeholder-purple-300/80  focus:outline-none  focus:bg-purple-700/50  transition-all shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] z-10 border border-black font-bold text-base sm:text-lg lg:text-xl"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center px-2 sm:px-5 m5-6 sm:mt-10 mb-6 sm:mb-10">
        <Link
          to="/forgot-password"
          className="text-xs sm:text-lg lg:text-xl font-semibold hover:underline transition-all"
        >
          Forgot Password?
        </Link>
        <div className="flex items-center gap-2">
          <input
            id="CheckBox"
            type="checkbox"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-5 h-5 accent-purple-500"
          />
        </div>
      </div>
      <div className="w-full px-2 sm:px-10">
        <button
          disabled={isLoading}
          className="bg-purple-700/40 font-semibold text-lg sm:text-xl lg:text-2xl w-full py-3 sm:py-4 rounded-lg shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] hover:bg-purple-600/50 disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
