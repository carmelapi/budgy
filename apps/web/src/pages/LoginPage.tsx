import { Button, FormControl, FormLabel, Alert, Select, MenuItem } from "@mui/material";
import Input from "@mui/material/Input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [baseCurrency, setBaseCurrency] = useState<string>("SEK");
  const [language, setLanguage] = useState<string>("EN");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [localError, setLocalError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login, signup, isAuthenticated, isLoading, error } = useAuth();

  /**
   * If user is already authenticated, redirect to dashboard
   * This prevents logged-in users from seeing the login page
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  /**
   * Handle login button click
   */
  const handleLogin = async () => {
    setLocalError(null);

    // Basic validation
    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }

    try {
      await login(email, password);
      // Navigation happens automatically via useEffect when isAuthenticated changes
    } catch (err) {
      // Error is already set in AuthContext, but we can add local handling if needed
      console.error("Login failed:", err);
    }
  };

  /**
   * Handle signup button click
   */
  const handleSignUp = async () => {
    setLocalError(null);

    // Basic validation
    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      await signup(email, password, baseCurrency, language);
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  /**
   * Handle Enter key press to submit form
   * Using onKeyDown instead of deprecated onKeyPress
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      mode === "login" ? handleLogin() : handleSignUp();
    }
  };

  /**
   * Toggle between login and signup modes
   */
  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setLocalError(null); // Clear errors when switching modes
  };

  // Display error from AuthContext or local error
  const displayError = error || localError;

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center bg-gray-50">
      <div className="flex flex-col justify-center items-center gap-6 bg-white rounded-lg shadow-md w-96 p-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>

        {/* Error message */}
        {displayError && (
          <Alert severity="error" className="w-full">
            {displayError}
          </Alert>
        )}

        {/* Email input */}
        <FormControl className="w-full">
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            fullWidth
          />
        </FormControl>

        {/* Password input */}
        <FormControl className="w-full">
          <FormLabel>Password</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            fullWidth
          />
        </FormControl>

        {/* Language selector (only for signup) */}
        {mode === "signup" && (
          <FormControl className="w-full">
            <FormLabel>Language</FormLabel>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isLoading}
              fullWidth
            >
              <MenuItem value="EN">English</MenuItem>
              <MenuItem value="IT">Italiano</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Currency selector (only for signup) */}
        {mode === "signup" && (
          <FormControl className="w-full">
            <FormLabel>Preferred Currency</FormLabel>
            <Select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              disabled={isLoading}
              fullWidth
            >
              <MenuItem value="SEK">SEK - Swedish Krona</MenuItem>
              <MenuItem value="EUR">EUR - Euro</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Submit button */}
        <Button
          variant="contained"
          onClick={mode === "login" ? handleLogin : handleSignUp}
          disabled={isLoading}
          fullWidth
          className="mt-2"
        >
          {isLoading
            ? "Please wait..."
            : mode === "login"
            ? "Login"
            : "Sign Up"}
        </Button>

        {/* Mode toggle */}
        <div className="text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:underline font-medium"
                disabled={isLoading}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:underline font-medium"
                disabled={isLoading}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
