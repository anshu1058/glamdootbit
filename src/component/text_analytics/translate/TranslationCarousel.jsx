import React, { useState } from "react";
import Slider from "react-slick";
import { Box, Button } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import DocViewforTranslation from "./DocViewerforTranslation";
import './slider.css';

export default function SimpleSlider({ translateddocs, setTranslatedDocurl }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Settings for the slider with autoplay enabled
    const settings = {
        className: "slider",
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true, // Enable autoplay
        autoplaySpeed: 2000, // Set autoplay speed (in milliseconds)
        centerMode: false,
        centerPadding: "40px",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    infinite: false,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    infinite: false,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    // Toggle the slider visibility
    const toggleExpansion = () => {
        setIsExpanded((prevExpanded) => !prevExpanded);
    };

    // Handle document click: set URL and close the slider
    const handleDocumentClick = (docUrl) => {
        setTranslatedDocurl(docUrl); // Set the selected document URL
        setIsExpanded(false); // Close the slider after selection
    };

    return (
        <Box sx={{ width: "100%", margin: "auto" }}>
            {/* Button to toggle expansion */}
            <Button
                style={{
                    width: '100%',
                    height: '35px',
                    textAlign: 'center',
                    color: "black",
                    fontSize: '12px',
                    cursor: 'pointer',
                    borderRadius: "18px",
                    background: "white"
                }}
                variant="contained"
                onClick={toggleExpansion}
            >
                {isExpanded ? "Preview" : "Translated Docs"}
            </Button>

            {/* Conditionally render the slider with transition */}
            <Box
                sx={{
                    position: "fixed",
                    top: isExpanded ? "7vh" : "-50vh", // Smooth slide in/out
                    left: 0,
                    right: 0,
                    height: "21vh",
                    margin: "8px",
                    zIndex: 1000, // Ensure it appears above other content
                    backgroundColor: "#fafafa", // Background for clarity
                    borderRadius: "12px",
                    // boxShadow: '1px 1px 0px grey',
                    opacity: isExpanded ? 1 : 0, // Control visibility smoothly
                    border: '1px solid grey',
                }}
            >
                {isExpanded && (
                    <Slider {...settings} id="slider">
                        {translateddocs.map((docUrl, index) => (
                            <>
                               
                                <div key={index} onClick={() => handleDocumentClick(docUrl.url)}>
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                            borderRadius: "8px",
                                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                                            cursor: "pointer",
                                            overflowY:"hidden",
                                            border:"1px solid #eef6f8",
                                            margin:"12px",
                                            height:"17vh"
                                        }}
                                    > 
                                         <div style={{ color: "black", textAlign: "center" }}>{docUrl.languageCode}</div>
                                        {/* Rendering document using DocViewforTranslation for each document */}
                                        <DocViewforTranslation documentUrl={docUrl.url} docheight="25vh" overflowdoc="hidden" onClick={() => handleDocumentClick(docUrl.url)} />
                                    </Box>
                                </div>
                            </>
                        ))}
                    </Slider>
                )}
            </Box>
        </Box>
    );
}
