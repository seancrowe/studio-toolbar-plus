// ConfigModal.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useModalStore } from "../../modalStore.ts";
import { loadConfigFromDoc } from "../../studio/layoutConfigHandler.ts";
import type { LayoutConfig, Variables } from "../../types/layoutConfigTypes.ts";
import MultiSelect from '../LayoutMappingModal/MultiSelect.tsx';
import TagSelect from './TagSelect.tsx';

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
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const LayoutConfigContainer = styled.div`
  background-color: #1d1c20;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ConfigSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  color: #ffffff;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #333;
`;

const ConfigItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background-color: #252428;
  border-radius: 4px;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemTitle = styled.h4`
  font-size: 14px;
  color: #e0e0e0;
  margin: 0;
`;

const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InputLabel = styled.label`
  font-size: 12px;
  color: #a0a0a0;
`;

const Input = styled.input`
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 6px 8px;
  color: #fff;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const TextArea = styled.textarea`
  background-color: #333;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 6px 8px;
  color: #fff;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: #2b2930;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3a3840;
  }
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
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface ConfigModalProps {
  onExportCSV?: () => void;
}

interface LayoutConfigEditorProps {
  config: LayoutConfig;
  onChange: (updatedConfig: LayoutConfig) => void;
}

const LayoutConfigEditor: React.FC<LayoutConfigEditorProps> = ({ config, onChange }) => {
  // Function to handle layout changes
  const handleLayoutChange = (index: number, value: string) => {
    const updatedLayouts = [...config.layoutIds];
    // updatedLayouts[index] = value;
    //
    // onChange({
    //   ...config,
    //   layouts: updatedLayouts
    // });
  };

  // Function to add a new layout
  const addLayout = () => {
    // onChange({
    //   ...config,
    //   layouts: [...config.layouts, ""]
    // });
  };

  // Function to remove a layout
  const removeLayout = (index: number) => {
    const updatedLayouts = [...config.layoutIds];
    updatedLayouts.splice(index, 1);

    onChange({
      ...config,
      layoutIds: updatedLayouts
    });
  };

  // Function to handle variable changes
  const handleVariableChange = (
    variableName: string,
    field: keyof Variables[string],
    value: any
  ) => {
    const updatedVariables = { ...config.variables };

    if (field === 'folderPath') {
      updatedVariables[variableName] = {
        ...updatedVariables[variableName],
        folderPath: value
      };
    } else if (field === 'imageName') {
      updatedVariables[variableName] = {
        ...updatedVariables[variableName],
        imageName: Array.isArray(value) ? value : [value]
      };
    } else if (field === 'dependents') {
      updatedVariables[variableName] = {
        ...updatedVariables[variableName],
        dependents: value
      };
    }

    onChange({
      ...config,
      variables: updatedVariables
    });
  };

  // Function to add a new variable
  const addVariable = () => {
    const newVarName = `Variable_${Object.keys(config.variables).length + 1}`;
    const updatedVariables = {
      ...config.variables,
      [newVarName]: {
        dependents: {},
        folderPath: "",
        imageName: [""]
      }
    };

    onChange({
      ...config,
      variables: updatedVariables
    });
  };

  // Function to remove a variable
  const removeVariable = (variableName: string) => {
    const updatedVariables = { ...config.variables };
    delete updatedVariables[variableName];

    onChange({
      ...config,
      variables: updatedVariables
    });
  };

  const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

  return (
    <LayoutConfigContainer>
      {/* Layouts Section */}
      <ConfigSection>
        <SectionTitle>Layouts</SectionTitle>
        {config.layoutIds.map((layout, index) => (
          <ConfigItem key={`layout-${index}`}>
            <ItemHeader>
              <ItemTitle>Layout {index + 1}</ItemTitle>
              <Button onClick={() => removeLayout(index)}>Remove</Button>
            </ItemHeader>
            <InputGroup>
              <MultiSelect title="List" options={options} />
              <TagSelect options={options} />
              <InputLabel>Name</InputLabel>
              <Input
                type="text"
                value={layout}
                onChange={(e) => handleLayoutChange(index, e.target.value)}
              />
            </InputGroup>
          </ConfigItem>
        ))}
        <Button onClick={addLayout}>Add Layout</Button>
      </ConfigSection>

      {/* Variables Section */}
      <ConfigSection>
        <SectionTitle>Variables</SectionTitle>
        {Object.entries(config.variables).map(([varName, varConfig]) => (
          <ConfigItem key={`var-${varName}`}>
            <ItemHeader>
              <ItemTitle>{varName}</ItemTitle>
              <Button onClick={() => removeVariable(varName)}>Remove</Button>
            </ItemHeader>
            <ItemContent>
              <InputGroup>
                <InputLabel>Folder Path</InputLabel>
                <Input
                  type="text"
                  value={varConfig.folderPath}
                  onChange={(e) => handleVariableChange(varName, 'folderPath', e.target.value)}
                />
              </InputGroup>

              <InputGroup>
                <InputLabel>Image Names (comma separated)</InputLabel>
                <Input
                  type="text"
                  value={varConfig.imageName.join(', ')}
                  onChange={(e) => {
                    const imageNames = e.target.value.split(',').map(name => name.trim());
                    handleVariableChange(varName, 'imageName', imageNames);
                  }}
                />
              </InputGroup>

              <InputGroup>
                <InputLabel>Dependents (JSON format)</InputLabel>
                <TextArea
                  value={JSON.stringify(varConfig.dependents, null, 2)}
                  onChange={(e) => {
                    try {
                      const dependents = JSON.parse(e.target.value);
                      handleVariableChange(varName, 'dependents', dependents);
                    } catch (error) {
                      // Handle JSON parse error
                      console.error("Invalid JSON format", error);
                    }
                  }}
                />
              </InputGroup>
            </ItemContent>
          </ConfigItem>
        ))}
        <Button onClick={addVariable}>Add Variable</Button>
      </ConfigSection>
    </LayoutConfigContainer>
  );
};

export const ConfigModal: React.FC<ConfigModalProps> = ({
  onExportCSV = () => console.log("Export CSV clicked"),
}) => {
  const isModalVisible = useModalStore((state) => state.isModalVisible);
  const isConfigLoaded = useModalStore((state) => state.isConfigLoaded);
  const { updateLayoutConfig, raiseError, layoutConfig } = useModalStore();

  const { hideModal, saveLayoutConfig, enableToolbar } = useModalStore();

  // Load config when component mounts if it's not loaded yet
  useEffect(() => {
    const loadConfig = async () => {
      if (!isConfigLoaded) {
        const result = await loadConfigFromDoc();

        result.fold((config) => updateLayoutConfig(config), () => raiseError(result))

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
  const handleConfigChange = (updatedConfig: LayoutConfig) => {
    updateLayoutConfig(updatedConfig);
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        {!isConfigLoaded ? (
          <LoadingSpinner />
        ) : (
          <ModalContent>
            <LayoutConfigEditor
              config={layoutConfig}
              onChange={handleConfigChange}
            />
          </ModalContent>
        )}
        <ModalFooter>
          <Button onClick={onExportCSV}>Export CSV</Button>
          <Button onClick={handleClose}>Close</Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};
