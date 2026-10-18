import { Button, FormControl, FormLabel, Alert, Select, MenuItem } from "@mui/material";
import Input from "@mui/material/Input";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [baseCurrency, setBaseCurrency] = useState<string>("SEK");
  const [language, setLanguage] = useState<string>("EN");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [localError, setLocalError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login, signup, isAuthenticated, isLoading, error } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    setLocalError(null);

    if (!email || !password) {
      setLocalError(t.auth.errors.bothRequired);
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleSignUp = async () => {
    setLocalError(null);

    if (!email || !password) {
      setLocalError(t.auth.errors.bothRequired);
      return;
    }

    if (password.length < 6) {
      setLocalError(t.auth.errors.passwordLength);
      return;
    }

    try {
      await signup(email, password, baseCurrency, language);
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      mode === "login" ? handleLogin() : handleSignUp();
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setLocalError(null);
  };

  const displayError = error || localError;

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="text-2xl font-bold text-gray-800">
          {mode === "login" ? t.auth.login.title : t.auth.signup.title}
        </h1>

        {displayError && (
          <Alert severity="error" className="w-full">
            {displayError}
          </Alert>
        )}

        <FormControl className="w-full">
          <FormLabel>{t.auth.login.email}</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder={t.auth.login.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            fullWidth
          />
        </FormControl>

        <FormControl className="w-full">
          <FormLabel>{t.auth.login.password}</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder={t.auth.login.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            fullWidth
          />
        </FormControl>

        {mode === "signup" && (
          <FormControl className="w-full">
            <FormLabel>{t.auth.signup.language}</FormLabel>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              disabled={isLoading}
              fullWidth
            >
              <MenuItem value="EN">{t.languages.EN}</MenuItem>
              <MenuItem value="IT">{t.languages.IT}</MenuItem>
            </Select>
          </FormControl>
        )}

        {mode === "signup" && (
          <FormControl className="w-full">
            <FormLabel>{t.auth.signup.currency}</FormLabel>
            <Select
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              disabled={isLoading}
              fullWidth
            >
              <MenuItem value="SEK">{t.currencies.SEK}</MenuItem>
              <MenuItem value="EUR">{t.currencies.EUR}</MenuItem>
            </Select>
          </FormControl>
        )}

        <Button
          variant="contained"
          onClick={mode === "login" ? handleLogin : handleSignUp}
          disabled={isLoading}
          fullWidth
          className="mt-2"
        >
          {isLoading
            ? t.auth.loading
            : mode === "login"
            ? t.auth.login.submit
            : t.auth.signup.signUp}
        </Button>

        <div className="text-sm text-gray-600">
          {mode === "login" ? (
            <>
              {t.auth.login.noAccount}{" "}
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:underline font-medium"
                disabled={isLoading}
              >
                {t.auth.login.signUpLink}
              </button>
            </>
          ) : (
            <>
              {t.auth.signup.hasAccount}{" "}
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:underline font-medium"
                disabled={isLoading}
              >
                {t.auth.signup.loginLink}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
