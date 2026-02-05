import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/Logo.svg";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { DialogContent } from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /**
   * Handle logout button click
   * Clears authentication and redirects to login page
   */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-white flex flex-row w-full h-[60px] justify-between py-4 px-6 items-center">
      <img src={logo} alt="Budgy brand" height="36px" />

      <div className="flex flex-row gap-4 items-center">
        {/* User email */}
        {user && (
          <span className="text-sm text-gray-600">
            Welcome, <span className="font-medium">{user.email}</span>
          </span>
        )}

        {/* Add button */}
        <Button variant="outlined" onClick={handleClickOpen}>
          Add
        </Button>

        {/* Logout button */}
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent></DialogContent>
      </Dialog>
    </div>
  );
}
