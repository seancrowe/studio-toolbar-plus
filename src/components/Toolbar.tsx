import styled from "styled-components";
import React, { type ReactNode, useCallback } from "react";
import { useAppStore } from "../modalStore";

// Styled components for the toolbar with dynamic visibility
const ToolbarStyle = styled.div<{ $visible: boolean }>`
  background-color: #1d1c20;
  position: fixed;
  top: 0;
  height: 21px;
  left: 50%;
  transform: translateX(-50%)
  translateY(${(props) => (props.$visible ? "0" : "-100%")});
  transition: transform 0.5s ease-in-out;
  width: 60%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center; // Center the items
  z-index: 9991;
`;

type ToolbarProps = {
  children?: ReactNode;
};

// Toolbar component that accepts children components and visibility prop
export const Toolbar: React.FC<ToolbarProps> = ({ children }) => {
  const { isToolbarVisible, isToolbarEnabled, hideToolbar } = useAppStore();

  return (
    <ToolbarStyle
      onMouseLeave={() => hideToolbar()}
      $visible={isToolbarVisible || isToolbarEnabled}
    >
      {children}
    </ToolbarStyle>
  );
};

// Styled components for the toolbar with dynamic visibility
const ToolbarHoverStyle = styled.div`
  position: fixed;
  top: 0;
  opacity: 0;
  height: 21px;
  left: 50%;
  transform: translateX(-50%);
  transition: transform 0.5s ease-in-out;
  width: 65%;
  display: flex;
  align-items: center;
  z-index: 9991;
`;

export const ToolbarHover: React.FC = () => {
  const { showToolbar } = useAppStore();

  return <ToolbarHoverStyle onMouseEnter={() => showToolbar()} />;
};

