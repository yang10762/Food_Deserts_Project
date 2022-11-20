import React from "react";
import styled from "styled-components";

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
  justify-content: space-evenly;
  background-color: #ebe9e9;
`;

export default function TextImageContent(props) {
  return <Layout>{props.children}</Layout>;
}
