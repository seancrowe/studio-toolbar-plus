import { type LayoutConfig } from "../layoutConfigTypes";
import { useAppStore } from "../modalStore";
import { loadConfigFromDoc } from "../studio/layoutConfigHandler";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Group, MantineProvider, Stack, Paper, Title, Divider, Modal, Text, Select } from "@mantine/core";
import { LayoutMultiSelect } from "./LayoutMultiSelect";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 90%;
  height: 90%;
  background-color: #4a4949;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const TopBar = styled.div`
  padding: 16px 20px;
  background-color: #3a3939;
  border-bottom: 1px solid #5a5a5a;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const BottomBar = styled.div`
  padding: 16px 20px;
  background-color: #3a3939;
  border-top: 1px solid #5a5a5a;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  &:after {
    content: "";
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #be4bdb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

type LayoutConfigEditorProps = {
  onExportCSV: () => void
  // config: LayoutConfig;
  // onChange: (updatedConfig: LayoutConfig) => void;
}

export const LayoutConfigModal: React.FC<LayoutConfigEditorProps> = ({
  onExportCSV = () => console.log("Export CSV clicked"),
}) => {

  const {
    isModalVisible,
    loadLayoutConfigs,
    layoutConfigs,
    raiseError,
    isLayoutConfigLoaded,
    hideModal,
    saveLayoutConfig,
    enableToolbar,
    documentState
  } = useAppStore();

  // Load config when component mounts if it"s not loaded yet
  useEffect(() => {
    const loadConfig = async () => {
      if (!isLayoutConfigLoaded) {
        const result = await loadConfigFromDoc();
        result.fold((config) => loadLayoutConfigs(config), () => raiseError(result))
      }
    };

    loadConfig();
  }, []);

  if (!isModalVisible) return null;

  const handleClose = () => {
    saveLayoutConfig();
    hideModal();
    enableToolbar();
  };

  // Handle layout config changes
  const handleConfigChange = (updatedConfig: LayoutConfig[]) => {
    loadLayoutConfigs(updatedConfig);
  };

  return (
    <MantineProvider defaultColorScheme="dark">
      <Modal
        styles={{
          body: {
            width: "100%",
            height: "90%",
            padding: "0px",
            backgroundColor: "#4a4949",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            overflow: "hidden",
          },
          content: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }
        }}
        centered
        fullScreen
        opened={isModalVisible}
        onClose={handleClose}
        withCloseButton={false}
      >
        <TopBar>
          <Title order={4} c="white">Layout Image Configuration Tool</Title>
        </TopBar>

        <Content>
          {!isLayoutConfigLoaded ? (
            <LoadingSpinner />
          ) : (
            <Stack h="100%" gap="md">
              {layoutConfigs.map((config, index) => (
                <Paper p="md">
                  <Title>Layout Configuration</Title>
                  <Title styles={{ root: { marginTop: "30px" } }} order={5} mb="md">Layout Dependencies</Title>
                  <LayoutMultiSelect
                    key={index}
                    layoutConfig={config}
                  />
                  <Divider styles={{ root: { marginTop: "30px" } }} />
                  <Title styles={{ root: { marginTop: "20px" } }} order={5} mb="md">Set Variables</Title>
                  {Object.keys(config.variables).map((varName) => (
                    <Paper key={varName} styles={{ root: { margin: "15px" } }} shadow="sm" radius="lg" p="xl">
                      <Select
                        label="Variable To Set"
                        placeholder="Select Variable"
                        data={['React', 'Angular', 'Vue', 'Svelte']}
                        searchable
                      />
                      <Text>
                        Use it to create cards, dropdowns, modals and other components that require background
                        with shadow
                      </Text>
                    </Paper>
                  ))}
                  <Button>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor">
                      <path d="M12 5l0 14"></path>
                      <path d="M5 12l14 0"></path>
                    </svg>
                    <span style={{ marginLeft: "10px" }}>Add Variable</span>
                  </Button>
                </Paper>
              ))}
            </Stack>
          )}
        </Content>

        <BottomBar>
          <Group justify="flex-end" gap="sm">
            <Button onClick={onExportCSV}>Export CSV</Button>
            <Button onClick={handleClose}>Close</Button>
          </Group>
        </BottomBar>
      </Modal>
    </MantineProvider>
  );
};
