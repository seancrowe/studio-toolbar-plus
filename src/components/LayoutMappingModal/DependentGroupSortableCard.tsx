import { ActionIcon, Text, Card, Input, Select } from "@mantine/core";
import { IconX, IconGripVertical } from "@tabler/icons-react";
import type { Variable, StudioList } from "../../types/layoutConfigTypes";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAppStore } from "../../modalStore";

export interface SortableCardProps {
  id: string;
  value: string | Variable;
  groupIndex: number;
  imageVariableId: string;
  mapId: string;
  onRemove: () => void;
  getDisplayValue: (value: string | Variable) => string;
}

// Sortable card component that wraps each card and makes it draggable
export const SortableCard: React.FC<SortableCardProps> = ({
  id,
  value,
  groupIndex,
  imageVariableId,
  mapId,
  onRemove,
  getDisplayValue,
}) => {
  const { state, effects, raiseError } = useAppStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    minWidth: "120px",
    height: "auto",
    minHeight: "80px",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    position: "relative" as const,
  };

  // Extract the index from the id (format: "item-{index}")
  const variableValueIndex = parseInt(id.toString().split("-")[1]);

  // Function to update the variable value
  const updateVarValue = (newValue: string | Variable) => {
    if (mapId && imageVariableId !== null && groupIndex !== null) {
      effects.studio.layoutImageMapping.updateVarValueFromDependentGroup({
        mapId,
        imageVariableId,
        groupIndex,
        variableValueIndex,
        variableValue: newValue,
      });
    } else {
      raiseError(
        new Error(
          `Failed to update variable value: mapId=${mapId}, imageVariableId=${imageVariableId}, groupIndex=${groupIndex}`,
        ),
      );
    }
  };

  // Get variables for select options, filtering out image and boolean types
  const selectOptions = state.studio.document.variables
    .filter((v) => v.type !== "image" && v.type !== "boolean")
    .map((v) => ({
      value: v.id,
      label: v.name,
    }));

  return (
    <Card ref={setNodeRef} shadow="sm" padding="xs" radius="md" style={style}>
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
        onClick={onRemove}
      >
        <IconX />
      </ActionIcon>

      <ActionIcon
        {...attributes}
        {...listeners}
        variant="subtle"
        size="md"
        style={{
          position: "absolute",
          top: "5px",
          left: "5px",
          cursor: "grab",
        }}
      >
        <IconGripVertical size={14} />
      </ActionIcon>

      <div style={{ marginTop: "20px", marginBottom: "5px" }}>
        {typeof value === "string" ? (
          <Input
            size="xs"
            value={value}
            onChange={(e) => updateVarValue(e.target.value)}
            placeholder="Enter value"
          />
        ) : value.type === "StudioList" ? (
          <Select
            size="xs"
            data={selectOptions}
            value={value.id || null}
            onChange={(newId) => {
              if (newId) {
                updateVarValue({
                  ...value,
                  id: newId,
                });
              }
            }}
            placeholder="Select variable"
            clearable
          />
        ) : (
          <Text size="sm" ta="center" style={{ wordBreak: "break-word" }}>
            {getDisplayValue(value)}
          </Text>
        )}
      </div>
    </Card>
  );
};
