import {
  Paper,
  Title,
  Grid,
  Text,
  MultiSelect,
  Group,
  Button,
} from "@mantine/core";
import { Result } from "typescript-result";
import type { ImageVariable, LayoutConfig } from "../../types/layoutConfigTypes";
import { useAppStore } from "../../modalStore";
import { IconPlus } from "@tabler/icons-react";

// Variable Card Component
interface VariableCardProps {
  variableConfig: ImageVariable;
  config: LayoutConfig;
  onAddDependent: (configId: string, variableId: string) => void;
}

export const VariableCard: React.FC<VariableCardProps> = ({
  variableConfig,
  config,
  onAddDependent,
}) => {
  const { state, raiseError, effects: events } = useAppStore();

  const variableDocument = state.studio.document.variables.find(
    (v) => v.id === variableConfig.id,
  );

  if (variableDocument == null) {
    raiseError(Result.error(new Error("variableDocument is null")));
    throw "ERROR - DO BETTER!!!";
  }

  // Handle dependent value changes
  const handleDependentValueChange = (
    depIndex: number,
    newValues: string[],
  ) => {
    const updatedConfig = [...state.studio.layoutImageMapping];
    const configIndex = state.studio.layoutImageMapping.findIndex(
      (c) => c.id === config.id,
    );
    const updateVariable = updatedConfig[configIndex].variables.find(
      (v) => v.id === variableConfig.id,
    );

    if (updateVariable == null) {
      const e = new Error("updateVariable is null");
      raiseError(Result.error(e));
      throw e;
    }

    updateVariable.dependents[depIndex].values = newValues;
    events.studio.layoutImageMapping.load(updatedConfig);
  };

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
        variableConfig.dependents.map((dependent, depIndex) => {
          const dependentVariable = state.studio.document.variables.find(
            (v) => v.id === dependent.variableId,
          );

          return (
            <Grid key={depIndex} mt="xs">
              <Grid.Col span={4}>
                <Text>{dependentVariable?.name || "Unknown"}</Text>
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
                        (item: { value: string; displayValue?: string }) => ({
                          value: item.value,
                          label: item.displayValue || item.value,
                        }),
                      ) || []
                    }
                    value={dependent.values}
                    onChange={(newValues) =>
                      handleDependentValueChange(depIndex, newValues)
                    }
                    placeholder="Select values"
                    size="xs"
                  />
                )}
              </Grid.Col>
            </Grid>
          );
        })
      )}

      <Group mt="md" justify="flex-end">
        <Button
          variant="subtle"
          size="sm"
          onClick={() => onAddDependent(config.id, variableConfig.id)}
        >
          <IconPlus />
        </Button>
      </Group>
    </Paper>
  );
};
