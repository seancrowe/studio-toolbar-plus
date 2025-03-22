// modalStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  type LayoutConfig,
  type ImageVariable,
  type DependentVar,
} from "./types/layoutConfigTypes";
import { Result, type Result as ResultType } from "typescript-result";
import { type Doc } from "./types/docStateTypes";

type LayoutImageMappingModalState = {
  isModalVisible: boolean;
  dependentModal: {
    isOpen: boolean;
    currentImageVariableId: string | null;
    currentSelectedVariables: string[];
  }
  currentAddImageMappingSelectedVariables: string[],
  isAddImageVariableMappingModalOpen: boolean;
  currentSelectedMapId: string | null;
};

type LayoutImageMappingModalEffects = {
  showModal: () => void;
  hideModal: () => void;
  dependentModal: {
    setIsOpen: (value:boolean) => void;
    setCurrentImageVariableId: (id:string) => void;
    setCurrentSelectedVariables: (value:string[]) => void;
  }
  setIsImageVariableMappingModalOpen: (value: boolean) => void;
  setCurrentAddImageMappingSelectedVariables: (value:string[]) => void;
  setCurrentSelectedMapId: (value:string) => void;
};



type StudioState = {
  document: Doc;
  layoutImageMapping: LayoutConfig[];
  isLayoutConfigLoaded: boolean;
};

type StudioEffects = {
  layoutImageMapping: {
    setLayoutIds: (data: { mapId: string; layoutIds: string[] }) => void;
    addImageVariable: (data: {
      configId: string;
      imageVariable: ImageVariable;
    }) => void;
    updateDependent: (data: {
      configId: string;
      imageVariableId: string;
      dependent: DependentVar;
    }) => void;
    load: (configs: LayoutConfig[]) => void;
    save: () => void;
  };
};

type StateStore = {
  modal: LayoutImageMappingModalState;
  studio: StudioState;
  isToolbarVisible: boolean;
  isToolbarEnabled: boolean;
};

type EffectStore = {
  modal: LayoutImageMappingModalEffects;
  studio: StudioEffects;
};

type AppStore = {
  state: StateStore;
  effects: EffectStore;
  errors: { error: Error; state: AppStore }[];
  raiseError: (error: Result<any, Error> | Error) => void;
  showToolbar: () => void;
  hideToolbar: () => void;
  enableToolbar: () => void;
  disableToolbar: () => void;
};

// Placeholder for the external save function
const saveLayoutConfigToJSON = (config: LayoutConfig[]) => {
  console.log("Saving config:", config);
  // To be implemented
};

export const useAppStore = () => appStore() as AppStore;

export const appStore = create<AppStore>()(
  immer((set, get) => ({
    state: {
      modal: {
        isAddImageVariableMappingModalOpen: false,
        currentAddImageMappingSelectedVariables: [],
        isModalVisible: true,
        currentSelectedMapId: null,
        dependentModal: {
          isOpen: false,
          currentImageVariableId: null,
          currentSelectedVariables: []
        }
      },
      studio: {
        isLayoutConfigLoaded: false,
        document: mockDocData(),
        layoutImageMapping: [
          {
            id: "",
            layoutIds: [],
            variables: [],
          },
        ],
      },
      isToolbarVisible: false,
      isToolbarEnabled: true,
    },
    effects: {
      modal: {
        showModal: () =>
          set((store) => {
            store.state.modal.isModalVisible = true;
            store.state.isToolbarVisible = false;
          }),
        hideModal: () =>
          set((store) => {
            store.state.modal.isModalVisible = false;
          }),
        setIsImageVariableMappingModalOpen: (value) =>
          set((store) => {
            store.state.modal.isAddImageVariableMappingModalOpen = value;
          }),
          setCurrentAddImageMappingSelectedVariables: (value) => 
            set(store => {
              store.state.modal.currentAddImageMappingSelectedVariables = value
            }),
          setCurrentSelectedMapId: (value) => {
            set(store => {
              store.state.modal.currentSelectedMapId = value;
            })
          },
          dependentModal: {
            setIsOpen: (value) => {
              set(store => {
                store.state.modal.dependentModal.isOpen = value;
              })
            },
            setCurrentImageVariableId: (id) => {
              set(store => {
                store.state.modal.dependentModal.currentImageVariableId = id;
              })
            },
            setCurrentSelectedVariables: (value) => {
              set(store => {
                store.state.modal.dependentModal.currentSelectedVariables = value;
              })
            },
          }
      },
      studio: {
        layoutImageMapping: {
          setLayoutIds: ({ mapId: configId, layoutIds }) =>
            set((store) => {
              if (store.state.studio.isLayoutConfigLoaded) {
                const targetLayout = store.state.studio.layoutImageMapping.find(
                  (layout) => layout.id == configId,
                );
                if (targetLayout) targetLayout.layoutIds = layoutIds;
              }
            }),
          addImageVariable: ({ configId, imageVariable }) =>
            set((store) => {
              if (store.state.studio.isLayoutConfigLoaded) {
                const targetLayout = store.state.studio.layoutImageMapping.find(
                  (layout) => layout.id == configId,
                );
                console.log("tartget Layout", targetLayout);
                if (targetLayout) {
                  const imageVariableIndex = targetLayout.variables.findIndex(
                    (imgVar) => imgVar.id == imageVariable.id,
                  );

                  if (imageVariableIndex == -1) {
                    targetLayout.variables.push(imageVariable);
                  } else {
                    targetLayout.variables[imageVariableIndex] = imageVariable;
                  }
                }
              }
            }),
          updateDependent: ({ configId, imageVariableId, dependent }) =>
            set((store) => {
              if (store.state.studio.isLayoutConfigLoaded) {
                const targetLayout = store.state.studio.layoutImageMapping.find(
                  (layout) => layout.id == configId,
                );

                if (targetLayout) {
                  const imageVariable = targetLayout.variables.find(
                    (imgVar) => imgVar.id == imageVariableId,
                  );

                  if (imageVariable) {
                    const dependentIndex = imageVariable.dependents.findIndex(
                      (dep) => dep.variableId == dependent.variableId,
                    );

                    if (dependentIndex == -1) {
                      // Add new dependent if it doesn't exist
                      imageVariable.dependents.push(dependent);
                    } else {
                      // Update existing dependent
                      imageVariable.dependents[dependentIndex] = dependent;
                    }
                  }
                }
              }
            }),
          load: (configs: LayoutConfig[]) =>
            set((store) => {
              if (!store.state.studio.isLayoutConfigLoaded)
                store.state.studio.isLayoutConfigLoaded = true;
              // Object.assign(store.state.studioState.layoutConfigs[], config);
              store.state.studio.layoutImageMapping = configs;
            }),
          save: () => {
            const store = get();
            saveLayoutConfigToJSON(store.state.studio.layoutImageMapping);
          },
        },
      },
    },
    errors: [],
    showToolbar: () =>
      set((state) => {
        state.state.isToolbarVisible = true;
      }),
    hideToolbar: () =>
      set((state) => {
        state.state.isToolbarVisible = false;
      }),
    enableToolbar: () =>
      set((state) => {
        state.state.isToolbarEnabled = true;
      }),
    disableToolbar: () =>
      set((state) => {
        state.state.isToolbarEnabled = false;
      }),
    raiseError: (error) => {
      if ((error as ResultType<any, Error>).isResult != null) {
        (error as ResultType<any, Error>).onFailure((error) =>
          set((state) => state.errors.push({ error, state })),
        );
      } else {
        set((state) => state.errors.push({ error: error as Error, state }));
      }
    },
  })),
);

appStore.subscribe((state, oldState) =>
  console.log("state", state, "oldState", oldState),
);


function mockDocData() {
  return {
    layouts: [
      {
        name: "Parent",
        id: "0",
      },

      {
        name: "Push",
        id: "1",
        parentId: "0",
      },
      {
        name: "Pull",
        id: "6",
        parentId: "0",
      },
    ],
    variables: [
      // 3 image variables
      {
        id: "img1",
        type: "image",
        name: "Header Logo",
        value: "https://example.com/images/logo.png",
      },
      {
        id: "img2",
        type: "image",
        name: "Profile Picture",
        value: "https://example.com/images/profile.jpg",
      },
      {
        id: "img3",
        type: "image",
        name: "Background Image",
        value: "https://example.com/images/background.jpg",
      },

      // 2 list variables
      {
        id: "list1",
        type: "list",
        name: "Country Selection",
        value: "United States",
        items: [
          { value: "us", displayValue: "United States" },
          { value: "ca", displayValue: "Canada" },
          { value: "uk", displayValue: "United Kingdom" },
          { value: "au", displayValue: "Australia" },
          { value: "de", displayValue: "Germany" },
        ],
      },
      {
        id: "list2",
        type: "list",
        name: "Document Categories",
        value: "financial",
        items: [
          { value: "financial", displayValue: "Financial Documents" },
          { value: "legal", displayValue: "Legal Documents" },
          { value: "medical", displayValue: "Medical Records" },
          { value: "educational", displayValue: "Educational Documents" },
        ],
      },

      // 3 shortText variables (1 requested + 2 additional to reach 8 total)
      {
        id: "text1",
        type: "shortText",
        name: "Document Title",
        value: "Quarterly Financial Report",
      },
      {
        id: "text2",
        type: "shortText",
        name: "Author Name",
        value: "Jane Doe",
      },
      {
        id: "text3",
        type: "shortText",
        name: "Department",
        value: "Finance",
      },
    ],
  } as Doc;
}
