import React, { useState, useEffect } from "react";
import { ActionIcon, Box, Transition, Group, Tooltip } from "@mantine/core";
import { IconLayoutFilled } from "@tabler/icons-react";
import { useAppStore } from "../modalStore";

export function Toolbar() {
  const [visible, setVisible] = useState(false);

  const { effects } = useAppStore();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Show toolbar when mouse is within 40px of the top of the screen
      if (event.clientY <= 40) {
        setVisible(true);
      }
    };

    // Add event listener for mouse movement on the document
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleLayoutClick = () => {
    effects.modal.showModal();
  };

  return (
    <Transition
      mounted={visible}
      transition="slide-down"
      duration={300}
      timingFunction="ease"
    >
      {(styles) => (
        <Box
          style={{
            ...styles,
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "60%",
            backgroundColor: "#25262b", // Dark background
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            borderBottom: "1px solid #373A40",
          }}
          onMouseLeave={() => setVisible(false)}
        >
          <Group gap="md">
            <Tooltip label="Layout" position="bottom" withArrow>
              <ActionIcon
                variant="filled"
                color="blue"
                size="lg"
                aria-label="Layout"
                onClick={handleLayoutClick}
              >
                <IconLayoutFilled size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Box>
      )}
    </Transition>
  );
}
