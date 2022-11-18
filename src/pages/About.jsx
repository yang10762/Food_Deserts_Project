import React from "react";
import shopper from "../images/shopper.jpg";
import groceries from "../images/groceries.jpg";
import Navigation from "../components/Navigation.jsx";
import TextImageContent from "../components/TextImageContent.jsx";
import styled from "styled-components";
import "../App.css";

const PaddedContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 25vw;
  max-height: 50vh;
  margin: 2.5vw 1.25vw;
  padding: 2.5vw 1.25vw;
`;
export default function About() {
  return (
    <div className="About">
      <Navigation />
      <TextImageContent>
        <PaddedContent>
          <h1>So what are food deserts?</h1>
          <p>
            Food deserts are areas with low access to affordable and nutritious
            food, often due to low proximity to supermarkets or scarcity of
            transportation.
          </p>
        </PaddedContent>
        <PaddedContent>
          <img
            src={groceries}
            style={{
              height: "30vh",
              width: "30vh",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
          {/* <div
            style={{
              backgroundImage: `url(${shopper})`,
              display: "block",
              maxWidth: "2300px",
              maxHeight: "950px",
              width: "auto",
              height: "auto",
              zIndex: 1,
            }}
          /> */}
        </PaddedContent>

        {/* <img
          src={groceries}
          className="Content-image"
          alt="groceries"
          style={{ width: "30%" }}
        /> */}
      </TextImageContent>
      <TextImageContent>
        {/* <img
          src={shopper}
          className="Content-image"
          alt="shopper"
          style={{ width: "30%" }}
        /> */}
        <img
          src={shopper}
          style={{
            height: "30vh",
            width: "30vh",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />

        <PaddedContent>
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
