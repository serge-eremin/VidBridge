import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react'
import { Routes, Route, Navigate } from 'react-router'

import { HomePage } from './pages/HomePage'
import { AuthPage } from './pages/AuthPage'

const App = () => {
  return (
    <>
      {/* Show the user button when the user is signed in */}
      <SignedIn>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<Navigate to={'/'} replace />} />
        </Routes>
      </SignedIn>

      {/* Show the sign-in and sign-up buttons when the user is signed out */}
      <SignedOut>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to={'/auth'} replace />} />
        </Routes>
        {/* <SignInButton mode="modal" />
        <SignUpButton /> */}
      </SignedOut>
    </>
  )
}

export default App
