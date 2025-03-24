import React, { useState, useEffect, useRef } from "react";
import {
  ActionIcon,
  Box,
  Transition,
  Group,
  Tooltip,
  Button,
  Modal,
  Text,
  Stack,
  Select,
} from "@mantine/core";
import {
  IconLayoutFilled,
  IconBug,
  IconMapBolt,
  IconArrowsTransferUpDown,
  IconDownload,
  IconUpload,
  IconSquareToggle,
} from "@tabler/icons-react";
import { useAppStore } from "../modalStore";
import {
  getCurrentDocumentState,
  loadDocumentFromJsonStr,
} from "../studio/documentHandler";
import { getStudio, convertOldMap } from "../studio/studioAdapter";
import { OldConverterModal } from "./OldConverter/OldConverterModal";

export function Toolbar() {
  const [visible, setVisible] = useState(false);
  const [isDownloadUploadModalOpen, setIsDownloadUploadModalOpen] =
    useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { effects, raiseError, state, disableToolbar } = useAppStore();

  const handleTestError = () => {
    raiseError(new Error("This is a test error message"));
  };

  const setVisibleIntercept = (value:boolean) => {
    console.log(value, state.isToolbarEnabled);
    if (!state.isToolbarEnabled) {
      setVisible(false);
    }
    setVisible(value);
  }

  const handleUploadDownloadClick = () => {
    setIsDownloadUploadModalOpen(true);
  };

  const handleDownload = async () => {
    try {
      const studioResult = await getStudio();
      if (!studioResult.isOk()) {
        raiseError(
          new Error(studioResult.error?.message || "Failed to get studio"),
        );
        return;
      }

      const documentResult = await getCurrentDocumentState(studioResult.value);
      if (!documentResult.isOk()) {
        raiseError(
          new Error(
            documentResult.error?.message || "Failed to get document state",
          ),
        );
        return;
      }

      // Create a blob from the document state
      const jsonStr = JSON.stringify(documentResult.value, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });

      // Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.json";
      document.body.appendChild(a);
      a.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    } catch (error) {
      raiseError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;

        const studioResult = await getStudio();
        if (!studioResult.isOk()) {
          raiseError(
            new Error(studioResult.error?.message || "Failed to get studio"),
          );
          return;
        }

        const loadResult = await loadDocumentFromJsonStr(
          studioResult.value,
          content,
        );
        if (!loadResult.isOk()) {
          raiseError(
            new Error(loadResult.error?.message || "Failed to load document"),
          );
          return;
        }

        setIsDownloadUploadModalOpen(false);
      };
      reader.readAsText(file);
    } catch (error) {
      raiseError(error instanceof Error ? error : new Error(String(error)));
    }

    // Reset the file input
    if (event.target) {
      event.target.value = "";
    }
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Show toolbar when mouse is within 40px of the top of the screen and 60% of the center horizontally
      // const screenWidth = window.innerWidth;
      // const centerX = screenWidth / 2;
      // const mouseX = event.clientX;
      // const distanceToCenter = Math.abs(mouseX - centerX);
      // const isWithinCenter = distanceToCenter <= screenWidth * 0.8;
      //
      // if (event.clientY <= 40 && isWithinCenter) {
      //   setVisible(true);
      // }

      if (event.clientY <= 40) {
          setVisibleIntercept(true);
      }
      if (event.clientY > 50) {
        setVisibleIntercept(false);
      }
    };

    // Add event listener for mouse movement on the document
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleLayoutClick = () => {
    setVisible(false);
    disableToolbar();
    effects.modal.showModal();
  };

  return (
    <>
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
            <Group gap="lg">
              {/* <Tooltip
                label="Convert Old JSON to Layout Map"
                position="bottom"
                withArrow
              >
                <ActionIcon
                  variant="filled"
                  color="blue"
                  size="lg"
                  aria-label="Convert"
                  onClick={() => setIsConvertModalOpen(true)}
                >
                  <IconSquareToggle size={20} />
                </ActionIcon>
              </Tooltip> */}
              <Tooltip
                label="Upload/Download Document"
                position="bottom"
                withArrow
              >
                <ActionIcon
                  variant="filled"
                  color="blue"
                  size="lg"
                  aria-label="Upload/Download"
                  onClick={handleUploadDownloadClick}
                >
                  <IconArrowsTransferUpDown size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Layout Image Mapper" position="bottom" withArrow>
                <ActionIcon
                  variant="filled"
                  color="blue"
                  size="lg"
                  aria-label="Layout"
                  onClick={handleLayoutClick}
                >
                  <IconMapBolt size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Test Error" position="bottom" withArrow>
                <ActionIcon
                  variant="filled"
                  color="red"
                  size="lg"
                  aria-label="Test Error"
                  onClick={handleTestError}
                >
                  <IconBug size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Box>
        )}
      </Transition>

      {/* Upload/Download Modal */}
      <Modal
        opened={isDownloadUploadModalOpen}
        onClose={() => setIsDownloadUploadModalOpen(false)}
        title="Document Upload/Download"
        centered
      >
        <Stack>
          <Text size="sm">
            Uploading and downloading only transfers the JSON not assets.
          </Text>

          <Group>
            <Button onClick={handleDownload} color="blue">
              <Group gap="xs">
                <IconDownload size={20} />
                <span>Download</span>
              </Group>
            </Button>

            <Button onClick={handleUpload} color="green">
              <Group gap="xs">
                <IconUpload size={20} />
                <span>Upload</span>
              </Group>
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Hidden file input for upload */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".json"
        onChange={handleFileChange}
      />

      {/* Old Converter Modal */}
      <OldConverterModal
        isConvertModalOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
      />
    </>
  );
}
