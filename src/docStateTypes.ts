export type Layout = {
  name: string;
  id: string;
  parentId?: string;
};

export type Variable =  {
  id: string;
  type: "image" | "shortText";
  name: string;
  value: string;
} | {

  id: string;
  type: "list";
  name: string;
  value: string;
  items: Item[];
}

export type Item = {
  value: string;
  displayValue?: string;
};

export type Doc = {
  layouts: Layout[];
  variables: Variable[]; 
};
