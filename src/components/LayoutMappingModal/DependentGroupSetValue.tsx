import { Group, ActionIcon, Text, Card, ScrollArea, Menu } from "@mantine/core";
import { IconPlus, IconX, IconAbc, IconList } from "@tabler/icons-react";
import type { Variable, StudioList } from "../../types/layoutConfigTypes";
import { useAppStore } from "../../modalStore";

interface DependentGroupSetValueProps {
  groupIndex: number;
  imageVariableId: string;
  mapId: string;
  variableValue: (string | Variable)[];
}

export const DependentGroupSetValue: React.FC<DependentGroupSetValueProps> = ({
  groupIndex,
  imageVariableId,
  mapId,
  variableValue,
}) => {
  const { effects } = useAppStore();

  // Function to handle removing a variable value
  const handleRemoveVarValue = (valueIndex: number) => {
    effects.studio.layoutImageMapping.removeVarValueFromDependentGroup({
      mapId,
      imageVariableId,
      groupIndex,
      variableValueIndex: valueIndex,
    });
  };

  // Function to handle adding a new string value
  const handleAddStringValue = () => {
    effects.studio.layoutImageMapping.addVarValueToDependentGroup({
      mapId,
      imageVariableId,
      groupIndex,
      variableValue: "",
    });
  };

  // Function to handle adding a new list variable
  const handleAddListVariable = () => {
    effects.studio.layoutImageMapping.addVarValueToDependentGroup({
      mapId,
      imageVariableId,
      groupIndex,
      variableValue: {
        id: null,
        type: "StudioList" as StudioList,
        transform: [],
      },
    });
  };

  // Helper function to display the value (either string or Variable)
  const getDisplayValue = (value: string | Variable): string => {
    if (typeof value === "string") {
      return value;
    } else {
      return `Variable: ${value.id}`;
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <Text fw={500} size="sm" mb={5}>
        Value =
      </Text>
      <ScrollArea scrollbarSize={6} type="scroll" scrollHideDelay={500}>
        <Group gap="xs" wrap="nowrap" style={{ minWidth: "100%" }}>
          {variableValue.map((value, index) => (
            <Card
              key={index}
              shadow="sm"
              padding="xs"
              radius="md"
              style={{
                minWidth: "120px",
                height: "80px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <ActionIcon
                variant="subtle"
                size="sm"
                color="red"
                radius="xl"
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                }}
                onClick={() => handleRemoveVarValue(index)}
              >
                <IconX />
              </ActionIcon>
              <Text size="sm" ta="center" style={{ wordBreak: "break-word" }}>
                {getDisplayValue(value)}
              </Text>
            </Card>
          ))}

          {/* Add new variable value card with menu */}
          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <Card
                shadow="sm"
                padding="xs"
                radius="md"
                style={{
                  minWidth: "80px",
                  height: "80px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px dashed #ccc",
                  cursor: "pointer",
                }}
              >
                <ActionIcon variant="transparent" size="lg">
                  <IconPlus />
                </ActionIcon>
              </Card>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Add Value Type</Menu.Label>
              <Menu.Item
                leftSection={<IconAbc size={14} />}
                onClick={handleAddStringValue}
              >
                String
              </Menu.Item>
              <Menu.Item
                leftSection={<IconList size={14} />}
                onClick={handleAddListVariable}
              >
                List Variable
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </ScrollArea>
    </div>
  );
};

