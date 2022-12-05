import React from "react";
import shopper from "../images/shopper.webp";
import groceries from "../images/groceries.webp";
import Navigation from "../components/Navigation.jsx";
import TextImageContent from "../components/TextImageContent.jsx";
import styled from "styled-components";
import "../App.css";

const PaddedContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 25vw;
  height: 40vh;
  margin: 2.5vw 1.25vw;
  padding: 2.5vw 1.25vw;
`;
export default function About() {
  const imageSquareDimension = "35vh";

  return (
    <div className="About">
      <Navigation />
      <TextImageContent color="white">
        <PaddedContent>
          <h1>So what are food deserts?</h1>
          <p>
            Food deserts are areas with low access to affordable and nutritious
            food, often due to low proximity to supermarkets or scarcity of
            transportation.
          </p>
        </PaddedContent>
        {/* <PaddedContent> */}
        <img
          src={groceries}
          style={{
            height: imageSquareDimension,
            width: imageSquareDimension,
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
        {/* </PaddedContent> */}
      </TextImageContent>
      <TextImageContent color="#666A86">
        <img
          src={shopper}
          style={{
            height: imageSquareDimension,
            width: imageSquareDimension,
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />

        <PaddedContent style={{ color: "#EBE9E9" }}>
          <h1>How does Food Desert Finder Help?</h1>
          <p>
            In a country full of seemingly abundant food options we often forget
            about the many food deserts throughout the US that could exist even
            one town over from us. Food Desert Finder intends to illustrate this
            issue using visually appealing heatmap technology to educate the
            public on just how prevalent food deserts are and their secondary
            effects on the health of Americans.
          </p>
        </PaddedContent>
      </TextImageContent>
      <header className="About"></header>
    </div>
  );
}
