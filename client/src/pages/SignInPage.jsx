import React, { useState } from 'react';
import { useSignIn, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import LoginPage from '../components/ui/animated-characters-login-page';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (email, password) => {
    if (!isLoaded) return;
    
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/dashboard");
      } else {
        // Handle additional steps like MFA if needed
        console.log("Sign in status:", result.status);
        setError("Account requires additional verification steps.");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError(err.errors ? err.errors[0].message : "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sign-in/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  };

  return (
    <Routes>
      <Route path="sso-callback" element={<AuthenticateWithRedirectCallback />} />
      <Route path="*" element={
        <div className="dark">
          <LoginPage 
            onSubmit={handleSignIn} 
            onGoogleSignIn={handleGoogleSignIn}
            isLoading={isLoading} 
            error={error} 
          />
        </div>
      } />
    </Routes>
  );
}
