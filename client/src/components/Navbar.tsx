import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/Logo.svg";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const { user, logout, updateSettings } = useAuth();
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

  const handleOpenSettings = () => {
    setSelectedCurrency(user?.base_currency || "SEK");
    setSelectedLanguage(user?.language || "EN");
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateSettings(selectedCurrency, selectedLanguage);
      setSettingsOpen(false);
    } catch (err) {
      console.error("Failed to update settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white flex flex-row w-full h-[60px] justify-between py-4 px-6 items-center">
      <img src={logo} alt="Budgy brand" height="36px" />

      <div className="flex flex-row gap-4 items-center">
        {user && (
          <button
            onClick={handleOpenSettings}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Welcome, <span className="font-medium">{user.email}</span>
          </button>
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

      <Dialog open={settingsOpen} onClose={handleCloseSettings} maxWidth="sm" fullWidth>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <FormControl fullWidth>
              <FormLabel>Language</FormLabel>
              <Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={saving}
              >
                <MenuItem value="EN">English</MenuItem>
                <MenuItem value="IT">Italiano</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>Currency</FormLabel>
              <Select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                disabled={saving}
              >
                <MenuItem value="SEK">SEK - Swedish Krona</MenuItem>
                <MenuItem value="EUR">EUR - Euro</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
