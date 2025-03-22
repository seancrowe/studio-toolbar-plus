import {
  Paper,
  Group,
  Title,
  ActionIcon,
  Divider,
  Button,
} from "@mantine/core";
import { useState } from "react";
import type { LayoutConfig } from "../../types/layoutConfigTypes";
import { LayoutMultiSelect } from "./LayoutMultiSelect";
import { VariableCard } from "./VariableCard";
import {
  IconSettings,
  IconCaretDownFilled,
  IconPlus,
  IconCopy,
  IconTrashFilled,
} from "@tabler/icons-react";
import { useAppStore } from "../../modalStore";

// Layout Config Section Component
interface LayoutConfigSectionProps {
  config: LayoutConfig;
  index: number;
  // onAddVariable: () => void;
  // onAddDependent: (configId: string, variableId: string) => void;
}

export const LayoutConfigSection: React.FC<LayoutConfigSectionProps> = ({
  config,
  index,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [menuOpened, setMenuOpened] = useState(false);
  const {effects: events} = useAppStore();

  return (
    <Paper key={index} p="md">
      <Group justify="space-between" mb={20}>
        <Title>Layout Configuration</Title>
        <Group>
          <Group gap="xs">
            <ActionIcon
              size="lg"
              radius="xl"
              onClick={() => setMenuOpened(true)}
            >
              <IconCopy />
            </ActionIcon>

            <ActionIcon
              size="lg"
              color= "red" 
              radius="xl"
              onClick={() => setMenuOpened(true)}
            >
              <IconTrashFilled />
            </ActionIcon>
            <ActionIcon
              size="lg"
              radius="xl"
              onClick={() => setIsOpen(!isOpen)}
              style={{
                transform: isOpen ? "rotate(0deg)" : "rotate(90deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <IconCaretDownFilled />
            </ActionIcon>
          </Group>
        </Group>
      </Group>

      {isOpen && (
        <>
          <Title styles={{ root: { marginTop: "30px" } }} order={5} mb="md">
            Layout Dependencies
          </Title>
          <LayoutMultiSelect key={index} layoutConfig={config} />
          <Divider styles={{ root: { marginTop: "30px" } }} />
          <Title styles={{ root: { marginTop: "20px" } }} order={5} mb="md">
            Set Variables
          </Title>

          {/* Display all variables from layoutConfig in their own Paper */}
          {config.variables.map((variableConfig) => (
            <VariableCard
              key={variableConfig.id}
              variableConfig={variableConfig}
              config={config}
              onAddDependent={()=>{}}
            />
          ))}

          {/* Add Variable button to open modal */}
          <Button onClick={() => {
            events.modal.setIsImageVariableMappingModalOpen(true);
            events.modal.setCurrentSelectedMapId(config.id);
            events.modal.setCurrentAddImageMappingSelectedVariables([]);
          }}>
            <IconPlus />
            <span style={{ marginLeft: "10px" }}>Add Variables</span>
          </Button>
        </>
      )}
    </Paper>
  );
};

/**
 * onAddVariable={() => {
                    const configIndex =
                      state.studio.layoutImageMapping.findIndex(
                        (c) => c.id === config.id,
                      );
                    setCurrentConfigIndex(configIndex);
                    events.modal.setIsAddVariableModalOpen(true);
                  }}
 */
