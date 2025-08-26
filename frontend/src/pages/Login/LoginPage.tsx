import GlassmorphismCard from "@/components/Glassmorphism/GlassmorphismCard";
import React, { useState } from "react";
import CSPSLogo from "@/assets/CSPSLogo.png";
import { GlassTextField } from "@/components/Glassmorphism/GlassTextField";
import Layout from "@/components/Layouts/Layout";
import { Checkbox, IconButton, InputAdornment } from "@mui/material";
import { ThinCircleIcon } from "@/components/CustomIcon/ThinCircleIcon";
import GlassButton from "@/components/Glassmorphism/GlassButton";
import { motion } from "framer-motion";
import Logo from "@/assets/CSPS_LOGO.png";
import { useAuthStore } from "@/store/authStore";
import { Navigate, useNavigate } from "react-router-dom";
import WestIcon from "@mui/icons-material/West";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Snackbar from "@mui/material/Snackbar";

const Index = () => {
  const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const MAX: number = 8;
  const [idNumber, setIdNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const login = useAuthStore((state: any) => state.login);
  const navigate = useNavigate();

  const handleIdNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    if (numericValue.length <= MAX) {
      setIdNumber(numericValue);
    }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = login(idNumber, password);

    if (result.success) navigate("/dashboard");
    else {
      setErrorMsg("Invalid credentials.");
      setOpen(true);
      return;
    }
  };

  return (
    <Layout className="relative flex items-center justify-center px-4 sm:px-8 lg:px-20 py-8 sm:py-12">
      <div className="hidden md:flex absolute top-42 left-0 w-[84vw] h-[84vw] max-w-[950px] max-h-[950px] lg:top-0 lg:right-[-17rem]">
        <img
          src={Logo}
          alt="CSPS Background"
          className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-all duration-300"
        />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={errorMsg}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        ContentProps={{
          sx: {
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            color: "red",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          },
        }}
      />

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full relative"
      >
        <button
          className=" absolute top-[-5rem] left-0 text-white cursor-pointer"
          onClick={() => navigate("/")}
        >
          <WestIcon fontSize="large" />
        </button>
        <GlassmorphismCard className="w-full py-10 sm:py-20 lg:py-36 flex flex-col md:flex-row gap-10 md:gap-0">
          {/* Left */}
          <div className="text-white px-4 w-full flex flex-col justify-center">
            <img
              src={CSPSLogo}
              alt="CSPS-Logo"
              className="w-32 sm:w-40 md:w-48"
            />
            <p className="mt-5 mb-5 text-2xl sm:text-4xl md:text-5xl font-semibold px-2">
              Sign in
            </p>
            <p className="font-normal text-lg sm:text-xl md:text-2xl px-2 text-gray-300">
              Connect, Collaborate, and Grow Together
            </p>
          </div>

          {/* Right */}
          <div className="w-full p-4">
            <form className="space-y-5 w-full" onSubmit={handleLogin}>
              <GlassTextField
                label="ID Number"
                type="text"
                blur={8}
                borderRadius="1rem"
                value={idNumber}
                onChange={handleIdNumberChange}
              />
              <div className="text-white w-full text-right px-2 mt-[-1rem]">
                <p className="font-semibold text-gray-500">
                  {idNumber.length}/{MAX}
                </p>
              </div>
              <GlassTextField
                label="Password"
                type={showPassword ? "text" : "password"}
                blur={8}
                borderRadius="1rem"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          aria-label="toggle password visibility"
                          sx={{ color: "#ffffff" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <p className="text-gray-500 hover:underline cursor-pointer text-sm sm:text-base">
                  Forgot password?
                </p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    icon={<ThinCircleIcon color="gray" strokeWidth={1} />}
                    checkedIcon={
                      <ThinCircleIcon color="#00bcd4" strokeWidth={1} checked />
                    }
                    sx={{
                      padding: 0,
                      "& .MuiSvgIcon-root": {
                        fontSize: 24,
                      },
                    }}
                  />
                  <p className="text-white text-sm sm:text-base">Remember me</p>
                </div>
              </div>

              <div className="w-full">
                <GlassButton className="w-full cursor-pointer">
                  <span className="py-4 sm:py-5 text-sm sm:text-base">
                    Sign in
                  </span>
                </GlassButton>
              </div>
            </form>
          </div>
        </GlassmorphismCard>
      </motion.div>
    </Layout>
  );
};

export default Index;
