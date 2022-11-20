import React from "react";
import styled from "styled-components";

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
  justify-content: space-evenly;
  align-items: center;
`;

export default function TextImageContent(props) {
  return (
    <Layout style={{ backgroundColor: props.color }}>{props.children}</Layout>
  );
}
