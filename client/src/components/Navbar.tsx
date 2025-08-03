import { useState } from "react";
import logo from "../assets/img/Logo.svg";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { DialogContent } from "@mui/material";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="bg-white flex flex-row w-full h-[60px] justify-between py-4 px-6 items-between">
      <img src={logo} alt="Budgy brand" height="36px" />
      <Button variant="outlined" onClick={handleClickOpen}>
        Add
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent></DialogContent>
      </Dialog>
    </div>
  );
}
