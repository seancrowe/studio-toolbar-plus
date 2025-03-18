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

export type DependentVarIds = string[];

export type Variables = {
  [id: string]: {
    dependents: DependentVarIds;
    useFolderPath: boolean;
    folderPath: string;
    imageName: (string | Variable)[];
  };
};

export type LayoutConfig = {
  id: string;
  layoutIds: string[];
  variables: Variables;
};
