import { Modal, Stack, MultiSelect, Group, Button } from "@mantine/core";
import type React from "react";
import { useAppStore } from "../../modalStore";

// Add Dependent Modal Component
// interface AddDependentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   variables: any[]; // Using any for simplicity, should be properly typed
//   selectedVariables: string[];
//   onSelectVariables: (values: string[]) => void;
//   onAdd: () => void;
// }
export const AddDependentModal: React.FC = () => {

  const {state, effects} = useAppStore();

  const onClose = () => {
    effects.modal.dependentModal.setIsOpen(false);
    effects.modal.dependentModal.setCurrentSelectedVariables([]);
  }

  const addDependent = () => {
    
  }

  return (
    <Modal
      opened={state.modal.dependentModal.isOpen}
      onClose={onClose}
      title="Add Dependent Variable"
      centered
    >
      <Stack>
        <MultiSelect
          label="Select Variable"
          placeholder="Choose a variable"
          data={state.studio.document.variables
            .filter((variable) => variable.type !== "image")
            .map((variable) => ({
              value: variable.id,
              label: variable.name,
            }))}
          value={state.modal.dependentModal.currentSelectedVariables}
          onChange={effects.modal.dependentModal.setCurrentSelectedVariables}
          searchable
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onClose} disabled={effects.modal.dependentModal.setCurrentSelectedVariables.length == 0}>
            Add
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
