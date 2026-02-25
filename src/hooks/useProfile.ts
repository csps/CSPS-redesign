// import { useState, useCallback, useEffect } from "react";
// import { profile } from "../api/auth";
// import { useAuthStore } from "../store/auth_store";
// import type { StudentResponse } from "../interfaces/student/StudentResponse";

// /**
//  * Custom hook for managing profile data and operations.
//  * 
//  * This hook provides access to the current user's profile data,
//  * handles fetching updates from the server, and manages loading/error states.
//  * It integrates with the AuthStore to ensure the global state is synchronized.
//  * 
//  * @returns {Object} An object containing:
//  * - profileData: The current student profile data
//  * - isLoading: Boolean indicating if a fetch is in progress
//  * - error: Any error message from fetching
//  * - refreshProfile: Function to manually trigger a profile refresh
//  */
// export const useProfile = () => {
//   const user = useAuthStore((s) => s.user);
//   const student = user as StudentResponse | null;
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   /**
//    * Refreshes the profile data by calling the profile API.
//    * Updates the global AuthStore upon success.
//    */
//   const refreshProfile = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       await profile();
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch profile");
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   // Initial fetch if student data is not yet in store (optional, depending on auth flow)
//   useEffect(() => {
//     if (!student) {
//       refreshProfile();
//     }
//   }, [student, refreshProfile]);

//   return {
//     profileData: student,
//     isLoading,
//     error,
//     refreshProfile,
//   };
// };
