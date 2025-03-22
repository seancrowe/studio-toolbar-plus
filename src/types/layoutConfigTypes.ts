export type TransformCommands = {
  find: string;
  replace: string;
  replaceAll: boolean;
  regex: boolean;
};

export type StudioText = "StudioText";
export type StudioList = "StudioList";
export type ConfigString = "ConfigString";

export type Text = {
  type: ConfigString;
};

export type Variable = {
  id: string;
  type: StudioText | StudioList;
  transform: TransformCommands[];
};

export type DependentVar = {
  variableId: string;
  values: string[];
};

export type ImageVariable = {
  id: string;
  dependents: DependentVar[];
  useFolderPath: boolean;
  folderPath: string;
  imageName: (string | Variable)[];
};

export type LayoutConfig = {
  id: string;
  layoutIds: string[];
  variables: ImageVariable[];
};
