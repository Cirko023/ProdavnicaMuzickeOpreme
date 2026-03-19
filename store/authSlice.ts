import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type User = {
    uid: string
    email: string
    ime: string
}

type AuthState = {
    korisnik: User | null
    jePrijavljen: boolean
}

const initialState: AuthState = {
    korisnik: null,
    jePrijavljen: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.korisnik = action.payload
            state.jePrijavljen = true
        },
        
        logout: (state) => {
            state.korisnik = null
            state.jePrijavljen = false
        },

        setUser: (state, action: PayloadAction<User>) => {
            state.korisnik = action.payload
        }
    }
})


export const { loginSuccess, logout, setUser } = authSlice.actions
export default authSlice.reducer