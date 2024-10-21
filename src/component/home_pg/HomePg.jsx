// src/components/homePage/HomePg.js
import React, { useContext }  from "react";
import "./homepg.css";
import { Box, Grid, Container } from "@mui/material";
import Poweredby from "../common/PoweredBy";
import glamlogo from "../../assets/gl2.png";
import HomeCard from "./HomeCard";
import cardData from "./CardData";
import BlobView from "../data_prepare/Azureblob";
import { ThemeContext } from "../header/ThemeContext";

const HomePg = () => {
    const cards = cardData(); // Get the card data
    const { theme } = useContext(ThemeContext); 
    const backgroundColor = theme === "dark" ? "#333" : "#fff"; 
    const color = theme === "dark" ? "#fff" : "black";
    return (
        <div className="background-hp">
            <Box className="page-container" >
                <div className="divlogo">
                    <img className="logo" src={glamlogo} alt="Logo" />
                </div>
                <Container component="main" maxWidth="lg" className="main-container" style={{backgroundColor,color:color}}>
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        style={{ marginLeft: '-22px' }}
                        className="main-containerGrid"
                    >
                        {cards.map((card, index) => (
                            <Grid item xs={12} sm={12} md={4} lg={4} key={index}>
                                <HomeCard
                                color={color}
                                    route={card.route}
                                    icon={card.icon}
                                    title={card.title}
                                    content={card.content}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    {/* <BlobView/> */}
                </Container>
                <Poweredby />
            </Box>
        </div>
    );
};

export default HomePg;
