import styled from "styled-components";
import React, { type ReactNode } from "react";

// Styled button component
const RoundedButton = styled.button`
  background-color: #4a4458;
  border: none;
  border-radius: 10px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 0 5px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #5a5468;
  }

  svg {
    color: white;
  }
`;

type ToolbarButtonProps = {
  name:string,
  onClick: () => void;
  svg: ReactNode;
};

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  svg,
  onClick,
}) => {
  return <RoundedButton onClick={onClick}>{svg}</RoundedButton>;
};
