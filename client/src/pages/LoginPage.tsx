import { Button, FormControl, FormLabel } from "@mui/material";
import Input from "@mui/material/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/dashboard");
      } else {
        console.error("Hey! There is an error in your sign up:", data.message);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-screen justify-center items-center ">
        <div className="flex flex-col justify-center items-center gap-12 bg-white rounded-lg shadow-md w-96 h-96">
          <FormControl>
            <FormLabel>
              <Input
                name="email"
                type="text"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormLabel>
          </FormControl>

          <FormControl>
            <FormLabel>
              <Input
                name="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormLabel>
          </FormControl>

          <div className="flex flex-row gap-4">
            <Button variant="outlined" id="signin" onClick={handleSignUp}>
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
