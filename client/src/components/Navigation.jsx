import React from "react";
import styled from "styled-components";
import { Button } from "shards-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../images/logo.svg";

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  padding: 2vh 0;
  //   margin: 2vh;
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  width: 96vw;
`;

const Pages = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
  justify-content: space-evenly;
  width: 50vw;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
  justify-content: center;
  width: 100vw;
`;

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const routes = ["/map", "/states", "/counties"];

  const tabs = ["Map", "States", "Counties"];

  return (
    <Wrapper>
      <Bar>
        <a
          className="App-link"
          href="/"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <img src={logo} style={{ height: "50px" }}></img>
          <span
            style={{
              marginLeft: "20px",
              fontWeight: "bold",
              color: "#666A86",
            }}
          >
            Food Desert Finder
          </span>
        </a>
        <Pages>
          {routes.map((route, index) => (
            <a
              className="App-link"
              style={{
                textDecoration:
                  location.pathname == route ? "underline" : "none",
                textDecorationColor: "#7FB069",
                textDecorationThickness: "3px",
                textUnderlineOffset: "4px",
              }}
              href={route}
              rel="noopener noreferrer"
              key={`tab-${index}`}
            >
              {tabs[index]}
            </a>
          ))}
        </Pages>
        <Button
          style={{
            color: "white",
            backgroundColor: "#7FB069",
            borderRadius: "20px",
            border: "none",
          }}
          onClick={() => {
            navigate("/map");
          }}
        >
          Find Deserts
        </Button>
      </Bar>
    </Wrapper>
  );
}
