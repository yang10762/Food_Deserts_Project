import React from "react";
import Button from "@mui/material/Button";
import { withStyles } from "@mui/material/styles";

const StyledButton = withStyles({
  root: {
    display: "flex",
    alignItems: "right",
    justifyContent: "center",
    height: "44px",
    padding: "0 25px",
    boxSizing: "border-box",
    borderRadius: 0,
    background: "#4f25f7",
    color: "#fff",
    transform: "none",
    boxShadow: "none",
    transition: "background .3s, border-color .3s, color .3s",
    "&hover": {
      backgroundColor: "#4f25f7",
    },
  },
  label: {
    textTransform: "capitalize",
  },
})(Button);

export default function CustomButton() {
  return <StyledButton variant="contained">Find Deserts</StyledButton>;
}
