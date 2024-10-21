// src/BumpedBox.js
import React from 'react';
import styled from 'styled-components';

const BumpedBoxContainer = styled.div`
  position: relative;
  width: 300px;
  height: 200px;
  background-color: #f0f0f0;
  margin: 20px auto;
  border: 2px solid #ccc;
  padding-top: 30px; /* Add padding to account for the bumped area */

  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 30px;
    background-color: #f0f0f0;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    clip-path: polygon(10% 100%, 0% 0%, 100% 0%, 90% 100%, 50% 90%);
    border: 2px solid #ccc;
    border-bottom: none;
  }
`;

const BumpedArea = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f0f0f0;
  padding: 5px 10px;
  border: 2px solid #ccc;
  border-bottom: none;
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
  z-index: 1; /* Ensure the text area is above other elements */
  width: 50%; /* Smaller width for the bumped area */
`;

const BumpedBox = () => {
  return (
    <BumpedBoxContainer>
      <BumpedArea>
        Bumped Text
      </BumpedArea>
      <div style={{ padding: '30px 10px' }}>
        Content inside the box
      </div>
    </BumpedBoxContainer>
  );
};

export default BumpedBox;
