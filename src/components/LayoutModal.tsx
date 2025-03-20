import { type LayoutConfig } from "../layoutConfigTypes";
import { useAppStore } from "../modalStore";
import { loadConfigFromDoc } from "../studio/layoutConfigHandler";
import React, { useEffect, useState, useMemo } from "react";
import { Result } from "typescript-result";
import styled from "styled-components";
import {
  Button,
  Group,
  MantineProvider,
  Stack,
  Paper,
  Title,
  Divider,
  Modal,
  Text,
  Select,
  Grid,
  MultiSelect,
} from "@mantine/core";
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

type LayoutConfigEditorProps = {
  onExportCSV: () => void;
  // config: LayoutConfig;
  // onChange: (updatedConfig: LayoutConfig) => void;
};

export const LayoutConfigModal: React.FC<LayoutConfigEditorProps> = ({
  onExportCSV = () => console.log("Export CSV clicked"),
}) => {
  // State for the Add Variable modal
  const [isAddVariableModalOpen, setIsAddVariableModalOpen] = useState(false);
  const [selectedImageVariable, setSelectedImageVariable] = useState<
    string | null
  >(null);
  const [currentConfigIndex, setCurrentConfigIndex] = useState<number>(-1);

  // State for the Add Dependent modal
  const [isAddDependentModalOpen, setIsAddDependentModalOpen] = useState(false);
  const [selectedDependentVariable, setSelectedDependentVariable] = useState<
    string | null
  >(null);
  const [currentVariableId, setCurrentVariableId] = useState<string>("");

  const {
    isModalVisible,
    loadLayoutConfigs,
    layoutConfigs,
    raiseError,
    isLayoutConfigLoaded,
    hideModal,
    saveLayoutConfig,
    enableToolbar,
    documentState,
    addImageVariableOnLayoutConfig,
    updateDependent,
  } = useAppStore();

  // Filter image variables from documentState
  const imageVariables = useMemo(() => {
    return documentState.variables.filter(
      (variable) => variable.type === "image",
    );
  }, [documentState.variables]);

  // Transform image variables into format required by Mantine Select
  const imageVariableOptions = useMemo(() => {
    return imageVariables.map((variable) => ({
      value: variable.id,
      label: variable.name,
    }));
  }, [imageVariables]);

  // Load config when component mounts if it"s not loaded yet
  useEffect(() => {
    const loadConfig = async () => {
      if (!isLayoutConfigLoaded) {
        const result = await loadConfigFromDoc();
        result.fold(
          (config) => loadLayoutConfigs(config),
          () => raiseError(result),
        );
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

  // Function to update the config with a new variable
  const updateFUNC = () => {
    if (selectedImageVariable && currentConfigIndex !== -1) {
      addImageVariableOnLayoutConfig({
        configId: layoutConfigs[currentConfigIndex].id,
        imageVariable: {
          id: selectedImageVariable,
          dependents: [],
          useFolderPath: true,
          folderPath: "",
          imageName: [],
        },
      });
    }

    // Reset state and close modal
    setSelectedImageVariable(null);
    setIsAddVariableModalOpen(false);
  };

  // Function to add a dependent to a variable
  const addDependent = () => {
    if (
      selectedDependentVariable &&
      currentVariableId &&
      currentConfigIndex !== -1
    ) {
      // Use the updateDependent function from the store
      updateDependent({
        configId: layoutConfigs[currentConfigIndex].id,
        imageVariableId: currentVariableId,
        dependent: {
          variableId: selectedDependentVariable,
          values: [],
        },
      });

      // Reset state and close modal
      setSelectedDependentVariable(null);
      setIsAddDependentModalOpen(false);
    }
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
          },
        }}
        centered
        fullScreen
        opened={isModalVisible}
        onClose={handleClose}
        withCloseButton={false}
      >
        <TopBar>
          <Title order={4} c="white">
            Layout Image Configuration Tool
          </Title>
        </TopBar>

        <Content>
          {!isLayoutConfigLoaded ? (
            <LoadingSpinner />
          ) : (
            <Stack h="100%" gap="md">
              {layoutConfigs.map((config, index) => (
                <Paper key={index} p="md">
                  <Title>Layout Configuration</Title>
                  <Title
                    styles={{ root: { marginTop: "30px" } }}
                    order={5}
                    mb="md"
                  >
                    Layout Dependencies
                  </Title>
                  <LayoutMultiSelect key={index} layoutConfig={config} />
                  <Divider styles={{ root: { marginTop: "30px" } }} />
                  <Title
                    styles={{ root: { marginTop: "20px" } }}
                    order={5}
                    mb="md"
                  >
                    Set Variables
                  </Title>
                  {/* Display all variables from layoutConfig in their own Paper */}
                  {config.variables.map((variableConfig) => {
                    const variableDocument = documentState.variables.find(
                      (v) => v.id == variableConfig.id,
                    );

                    if (variableDocument == null) {
                      raiseError(
                        Result.error(new Error("variableDocument is null")),
                      );
                      throw "ERROR - DO BETTER!!!";
                    }

                    return (
                      <Paper
                        key={variableConfig.id}
                        styles={{ root: { margin: "15px" } }}
                        shadow="sm"
                        radius="lg"
                        p="xl"
                      >
                        <Title order={6}>{variableDocument.name}</Title>
                        <Text size="sm" c="dimmed">
                          Type: {variableDocument.type}
                        </Text>

                        <Title order={6} mt="md">
                          Dependents:
                        </Title>
                        {variableConfig.dependents.length === 0 ? (
                          <Text size="sm" c="dimmed">
                            No dependents
                          </Text>
                        ) : (
                          variableConfig.dependents.map(
                            (dependent, depIndex) => {
                              const dependentVariable =
                                documentState.variables.find(
                                  (v) => v.id === dependent.variableId,
                                );

                              return (
                                <Grid key={depIndex} mt="xs">
                                  <Grid.Col span={4}>
                                    <Text>
                                      {dependentVariable?.name || "Unknown"}
                                    </Text>
                                  </Grid.Col>
                                  <Grid.Col span={3}>
                                    <Text size="sm" c="dimmed">
                                      {dependentVariable?.type || "Unknown"}
                                    </Text>
                                  </Grid.Col>
                                  <Grid.Col span={5}>
                                    {dependentVariable?.type === "list" && (
                                      <MultiSelect
                                        data={
                                          (dependentVariable as any).items?.map(
                                            (item: {
                                              value: string;
                                              displayValue?: string;
                                            }) => ({
                                              value: item.value,
                                              label:
                                                item.displayValue || item.value,
                                            }),
                                          ) || []
                                        }
                                        value={dependent.values}
                                        onChange={(newValues) => {
                                          const updatedConfig = [
                                            ...layoutConfigs,
                                          ];
                                          const configIndex =
                                            layoutConfigs.findIndex(
                                              (c) => c.id === config.id,
                                            );
                                          const updateVariable = updatedConfig[
                                            configIndex
                                          ].variables.find(
                                            (v) => v.id == variableConfig.id,
                                          );

                                          if (updateVariable == null) {
                                            const e = new Error(
                                              "updateVariable is null",
                                            );
                                            raiseError(Result.error(e));
                                            throw e;
                                          }
                                          updateVariable.dependents[
                                            depIndex
                                          ].values = newValues;
                                          handleConfigChange(updatedConfig);
                                        }}
                                        placeholder="Select values"
                                        size="xs"
                                      />
                                    )}
                                  </Grid.Col>
                                </Grid>
                              );
                            },
                          )
                        )}

                        <Group mt="md" justify="flex-end">
                          <Button
                            variant="subtle"
                            size="sm"
                            onClick={() => {
                              setCurrentConfigIndex(
                                layoutConfigs.findIndex(
                                  (c) => c.id === config.id,
                                ),
                              );
                              setCurrentVariableId(variableConfig.id);
                              setIsAddDependentModalOpen(true);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              width="24"
                              height="24"
                              stroke-width="2"
                              stroke-linejoin="round"
                              stroke-linecap="round"
                              stroke="currentColor"
                            >
                              <path d="M12 5l0 14"></path>
                              <path d="M5 12l14 0"></path>
                            </svg>
                          </Button>
                        </Group>
                      </Paper>
                    );
                  })}

                  {/* Add Variable button to open modal */}
                  <Button
                    onClick={() => {
                      const configIndex = layoutConfigs.findIndex(
                        (c) => c.id === config.id,
                      );
                      setCurrentConfigIndex(configIndex);
                      setIsAddVariableModalOpen(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      width="24"
                      height="24"
                      stroke-width="2"
                      stroke-linejoin="round"
                      stroke-linecap="round"
                      stroke="currentColor"
                    >
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

      {/* Modal for adding a new variable */}
      <Modal
        opened={isAddVariableModalOpen}
        onClose={() => {
          setIsAddVariableModalOpen(false);
          setSelectedImageVariable(null);
        }}
        title="Add Image Variable"
        centered
      >
        <Stack>
          <Select
            label="Select Image Variable"
            placeholder="Choose an image variable"
            data={imageVariableOptions}
            value={selectedImageVariable}
            onChange={setSelectedImageVariable}
            searchable
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddVariableModalOpen(false);
                setSelectedImageVariable(null);
              }}
            >
              Close
            </Button>
            <Button onClick={updateFUNC} disabled={!selectedImageVariable}>
              Add
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Modal for adding a dependent variable */}
      <Modal
        opened={isAddDependentModalOpen}
        onClose={() => {
          setIsAddDependentModalOpen(false);
          setSelectedDependentVariable(null);
        }}
        title="Add Dependent Variable"
        centered
      >
        <Stack>
          <Select
            label="Select Variable"
            placeholder="Choose a variable"
            data={documentState.variables
              .filter((variable) => variable.type !== "image")
              .map((variable) => ({
                value: variable.id,
                label: variable.name,
              }))}
            value={selectedDependentVariable}
            onChange={setSelectedDependentVariable}
            searchable
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDependentModalOpen(false);
                setSelectedDependentVariable(null);
              }}
            >
              Close
            </Button>
            <Button
              onClick={addDependent}
              disabled={!selectedDependentVariable}
            >
              Add
            </Button>
          </Group>
        </Stack>
      </Modal>
    </MantineProvider>
  );
};
