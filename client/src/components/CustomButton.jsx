import React from "react";
import { Button } from "shards-react";

export default function CustomButton(props) {
  return (
    <Button
      style={{
        marginTop: "3vh",
        color: "white",
        backgroundColor: "#7FB069",
        borderRadius: "20px",
        border: "none",
      }}
      onClick={() => {
        props.callback();
      }}
    >
      {props.text}
    </Button>
  );
}
