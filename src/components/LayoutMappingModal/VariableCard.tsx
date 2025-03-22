import {
  Paper,
  Title,
  Stack,
  Group,
  ActionIcon,
  Grid,
  Text,
  MultiSelect,
  Button,
  Card,
} from "@mantine/core";
import { IconTrashFilled, IconPlus } from "@tabler/icons-react";
import { Result } from "typescript-result";
import type {
  ImageVariable,
  LayoutMap,
  DependentVar,
} from "../../types/layoutConfigTypes";
import { useAppStore } from "../../modalStore";
import { AddDependentModal } from "./AddDependentModal";
import { DependentGroup } from "./DependentGroup";

// Variable Card Component
interface VariableCardProps {
  variableConfig: ImageVariable;
  config: LayoutMap;
}

export const VariableCard: React.FC<VariableCardProps> = ({
  variableConfig,
  config,
}) => {
  const { state, raiseError, effects } = useAppStore();

  const variableImageConfig = state.studio.document.variables.find(
    (v) => v.id === variableConfig.id,
  );

  if (variableImageConfig == null) {
    raiseError(Result.error(new Error("variableDocument is null")));
    throw "ERROR - DO BETTER!!!";
  }

  // Function to open the modal for adding a new group
  const handleAddGroup = () => {
    effects.modal.dependentModal.setCurrentImageVariableId(variableConfig.id);
    effects.modal.dependentModal.setIsOpen(true);
  };

  return (
    <Paper
      key={variableConfig.id}
      styles={{ root: { margin: "15px" } }}
      shadow="sm"
      radius="lg"
      p="md"
    >
      <Group justify="space-between">
        <Title order={5}>{variableImageConfig.name}</Title>
        <ActionIcon
          size="lg"
          color="red"
          radius="xl"
          onClick={() => {
            effects.studio.layoutImageMapping.removeImageVariable({
              mapId: config.id,
              imageVariableId: variableConfig.id,
            });
          }}
        >
          <IconTrashFilled />
        </ActionIcon>
      </Group>
      <Text size="small" c="dimmed">
        Type: {variableImageConfig.type}
      </Text>
      <Title order={6} mt="md">
        Dependents:
      </Title>

      {variableConfig.dependentGroup.length === 0 ? (
        <Text size="sm" c="dimmed">
          No dependents
        </Text>
      ) : (
        variableConfig.dependentGroup.map((dependentGroup, groupIndex) => (
          <DependentGroup
            key={groupIndex}
            dependentGroup={dependentGroup}
            groupIndex={groupIndex}
            variableConfig={variableConfig}
          />
        ))
      )}

      <Group mt="md" justify="flex-end">
        <Button variant="subtle" size="sm" onClick={handleAddGroup}>
          <Group align="center" style={{ gap: "5px" }}>
            <IconPlus size={16} />
            <Text>Add Group</Text>
          </Group>
        </Button>
      </Group>
    </Paper>
  );
};
