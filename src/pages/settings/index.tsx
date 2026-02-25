import { useState } from "react";
import Layout from "../../components/Layout";
import AuthenticatedNav from "../../components/AuthenticatedNav";

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Layout>
      <AuthenticatedNav />

      <div className="px-12 py-10 text-white">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <h1 className="text-4xl font-semibold">Settings</h1>

          {/* Theme Toggle
          <div className="flex items-center gap-3 bg-white/10 px-4 py-3 rounded-xl">
            <div className="leading-tight">
              <p className="text-sm">Theme</p>
              <p className="text-xs text-gray-300">Dark</p>
            </div>
            <div className="w-11 h-6 bg-white/20 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
            </div>
          </div>  */}
        </div>

        {/* Account Info */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Account Information</h2>
            <p className="text-sm text-gray-400">
              Update your photo or your personal information.
            </p>
          </div>

          {/*  Buttons */}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-white text-black text-sm px-4 py-2 rounded-md font-medium"
            >
              Update Information
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="text-sm text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button className="bg-white text-black text-sm px-4 py-2 rounded-md font-medium">
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="border-b border-white/20 my-6" />

        <div className="flex flex-col items-center mt-10">
          {/* Profile */}
          <div className="relative">
            <div className="h-40 w-40 bg-purple-700/40 rounded-md" />

            {isEditing && (
              <button className="absolute bottom-2 right-2 bg-white text-black rounded-full w-7 h-7 flex items-center justify-center text-xs">
                ✎
              </button>
            )}
          </div>

          <h3 className="text-lg font-semibold mt-5">Atillo, John Carl</h3>
          <p className="text-sm text-gray-400 mb-8">3rd Year</p>

          {/* Inputs */}
          <div className="w-full max-w-md space-y-4">
            <div>
              <label className="block text-xs text-gray-300 mb-1">
                {isEditing ? "Update email" : "Email"}
              </label>
              <input
                type="email"
                defaultValue="example@email.com"
                disabled={!isEditing}
                className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:outline-none disabled:opacity-70"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">
                {isEditing ? "Update password" : "Password"}
              </label>
              <input
                type="password"
                defaultValue="password"
                disabled={!isEditing}
                className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:outline-none disabled:opacity-70"
              />
            </div>

            {isEditing && (
              <div>
                <label className="block text-xs text-gray-300 mb-1">
                  Confirm password
                </label>
                <input
                  type="password"
                  className="w-full bg-black/40 border border-white/10 rounded-md px-4 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
