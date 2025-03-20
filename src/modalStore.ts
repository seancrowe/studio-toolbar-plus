// modalStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { type LayoutConfig, type ImageVariable, type DependentVar } from "./layoutConfigTypes";
import { Result } from "typescript-result";
import { type Doc } from "./docStateTypes";

interface AppStore {
  isModalVisible: boolean;
  isToolbarVisible: boolean;
  isToolbarEnabled: boolean;
  isLayoutConfigLoaded: boolean;
  errors: { error: Error; state: AppStore }[];
  documentState: Doc;
  layoutConfigs: LayoutConfig[];
  showModal: () => void;
  hideModal: () => void;
  showToolbar: () => void;
  hideToolbar: () => void;
  enableToolbar: () => void;
  disableToolbar: () => void;
  setLayoutIdsOnLayoutConfig: (data: {
    configId: string;
    layoutIds: string[];
  }) => void;
  addImageVariableOnLayoutConfig: (data: {
    configId: string;
    imageVariable: ImageVariable;
  }) => void;
updateDependent: (data:{configId:string, imageVariableId:string, dependent:DependentVar}) =>void,
  loadLayoutConfigs: (configs: LayoutConfig[]) => void;
  raiseError: (error: Result<any, Error>) => void;
  saveLayoutConfig: () => void;
}

// Placeholder for the external save function
const saveLayoutConfigToJSON = (config: LayoutConfig[]) => {
  console.log("Saving config:", config);
  // To be implemented
};

export const useAppStore = () => appStore() as AppStore;

export const appStore = create<AppStore>()(
  immer((set, get) => ({
    isModalVisible: true,
    isToolbarVisible: false,
    isToolbarEnabled: true,
    isLayoutConfigLoaded: false,
    errors: [],
    documentState: {
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
    },
    layoutConfigs: [
      {
        id: "",
        layoutIds: [],
        variables: [],
      },
    ],
    showModal: () =>
      set((state) => {
        state.isModalVisible = true;
        state.isToolbarVisible = false;
      }),
    hideModal: () =>
      set((state) => {
        state.isModalVisible = false;
      }),
    showToolbar: () =>
      set((state) => {
        state.isToolbarVisible = true;
      }),
    hideToolbar: () =>
      set((state) => {
        state.isToolbarVisible = false;
      }),
    enableToolbar: () =>
      set((state) => {
        state.isToolbarEnabled = true;
      }),
    disableToolbar: () =>
      set((state) => {
        state.isToolbarEnabled = false;
      }),
    setLayoutIdsOnLayoutConfig: ({ configId, layoutIds }) =>
      set((state) => {
        if (state.isLayoutConfigLoaded) {
          const targetLayout = state.layoutConfigs.find(
            (layout) => layout.id == configId,
          );
          if (targetLayout) targetLayout.layoutIds = layoutIds;
        }
      }),
    addImageVariableOnLayoutConfig: ({ configId, imageVariable }) =>
      set((state) => {
        if (state.isLayoutConfigLoaded) {
          const targetLayout = state.layoutConfigs.find(
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
    updateDependent: ({configId, imageVariableId, dependent}) =>
      set((state) => {
        if (state.isLayoutConfigLoaded) {
          const targetLayout = state.layoutConfigs.find(
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
    loadLayoutConfigs: (configs: LayoutConfig[]) =>
      set((state) => {
        if (!state.isLayoutConfigLoaded) state.isLayoutConfigLoaded = true;
        // Object.assign(state.layoutConfigs[], config);
        state.layoutConfigs = configs;
      }),
    raiseError: (error) => {
      error.onFailure((error) =>
        set((state) => state.errors.push({ error, state })),
      );
    },
    saveLayoutConfig: () => {
      const { layoutConfigs: layoutConfig } = get();
      saveLayoutConfigToJSON(layoutConfig);
    },
  })),
);

appStore.subscribe((state, oldState) =>
  console.log("state", state, "oldState", oldState),
);
