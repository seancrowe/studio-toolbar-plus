import { Modal, Stack, MultiSelect, Group, Button } from "@mantine/core";
import type React from "react";
import { useAppStore } from "../../modalStore";
import { useMemo } from "react";


export const AddMappingImageVariableModal: React.FC = () => {

    const {state, effects} = useAppStore();

    const possibleVariableValues = useMemo(() => {
        return state.studio.document.variables.filter(
          (variable) => variable.type === "image",
        ).map((variable) => ({
            value: variable.id,
            label: variable.name,
          }));
      }, [state.studio.document.variables]);

      const onClose = () => {
        effects.modal.setIsImageVariableMappingModalOpen(false);
        effects.modal.setCurrentAddImageMappingSelectedVariables([]);
    }

    const addImageVariables = () => {

        const mapId = state.modal.currentSelectedMapId

        if ( mapId == null) return

        state.modal.currentAddImageMappingSelectedVariables.forEach(variableId => {
            effects.studio.layoutImageMapping.addImageVariable({
                mapId: mapId,
                imageVariable: {
                  id: variableId,
                  dependentGroup: [],
                },
              });
        })
        onClose();
    }


    return (
        <Modal
            opened={state.modal.isAddImageVariableMappingModalOpen}
            onClose={onClose}
            title="Add Image Variables"
            centered
        >
            <Stack>
                <MultiSelect
                    label="Select Image Variable"
                    placeholder="Choose an image variable"
                    data={possibleVariableValues}
                    value={state.modal.currentAddImageMappingSelectedVariables}
                    onChange={effects.modal.setCurrentAddImageMappingSelectedVariables}
                    searchable />

                <Group justify="flex-end" mt="md">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    <Button onClick={addImageVariables} disabled={state.modal.currentAddImageMappingSelectedVariables.length == 0}>
                        Add
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
};

