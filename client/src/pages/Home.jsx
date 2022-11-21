import React from "react";
import Navigation from "../components/Navigation.jsx";
import styled from "styled-components";
import squiggle from "../images/squig.svg";
import tempUS from "../images/us.svg";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 60vh;
  margin: 2.5vw 1.25vw;
  padding: 2.5vw 1.25vw;
  width: 25vw;
  justify-content: space-between;
`;

const HeatMap = styled.div`
  display: flex;
  flex-direction: column;
  height: 60vh;
  // max-height: 50vh;
  margin: 2.5vw 1.25vw;
  padding: 2.5vw 1.25vw;
  width: 65vw;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  justify-content: space-between;
`;

export default function Home() {
  return (
    <div className="Home">
      <Navigation />
      <Wrapper>
        <Content>
          <h2 style={{ fontWeight: "normal", alignSelf: "center" }}>
            The place to be for
          </h2>
          <div className="intro">
            <h1 style={{ fontSize: "64px" }}>understanding</h1>
            <img
              src={squiggle}
              style={{
                zIndex: -1,
                position: "absolute",
                // height: "30vh",
                // width: "30vh",
                // objectFit: "cover",
                // borderRadius: "10px",
              }}
            />
            <h1 style={{ fontSize: "64px" }}>food accesibility in</h1>

            <h1 style={{ fontSize: "64px" }}>the United States</h1>
          </div>
          <div className="tagline">
            <h2 style={{ fontWeight: "normal" }}>The interactive food</h2>
            <h2 style={{ fontWeight: "normal" }}>desert visualizer.</h2>
          </div>
        </Content>
        <HeatMap>
          <img
            src={tempUS}
            style={{
              // height: "75vw",
              width: "65vw",
              objectFit: "contain",
              // borderRadius: "10px",
            }}
          />
        </HeatMap>
      </Wrapper>
    </div>
  );
}
