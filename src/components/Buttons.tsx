import React, { useEffect, useState } from "react";
import styled from "styled-components";

const RoundButtonStyle = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #2b2930;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
  color: white;
  padding: 0;
  
  &:hover {
    background-color: #3a3840;
  }
`;


// Round toggle button component
interface ExpandButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export const ExpandButton: React.FC<ExpandButtonProps> = ({
  isOpen,
  onClick,
}) => {
  return (
    <RoundButtonStyle onClick={onClick}>
      {isOpen ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="24"
          height="24"
          strokeWidth="2"
        >
          <path d="M6 10l6 6l6 -6h-12"></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="24"
          height="24"
          strokeWidth="2"
        >
          <path d="M14 6l-6 6l6 6v-12"></path>
        </svg>
      )}
    </RoundButtonStyle>
  );
};
