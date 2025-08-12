import { create } from 'zustand';


export const useAuthStore = create((set) => ({
    isAuthenticated: !!localStorage.getItem('token'),
    idNumber: null,


    login: (idNumber: string, password: string) => {
        if(password === "1234"){
            localStorage.setItem('token', 'generateFakeTokenHAHAHAHAHA');

            set({
                isAuthenticated: true,
            })

            return { success: true };
        }

        return { success: false, message: "Invalid credentials" }
    },

    logout: () => {
        localStorage.removeItem('token')
        set({ isAuthenticated: false })
    }
}))