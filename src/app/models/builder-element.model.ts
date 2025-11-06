export interface BuilderElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'container';
  content?: string;
  styles: {
    position: 'absolute' | 'relative';
    top: string;
    left: string;
    width: string;
    height: string;
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    border?: string;
    display?: string;
    flexDirection?: string;
    justifyContent?: string;
    alignItems?: string;
    zIndex?: number;
  };
  children?: BuilderElement[];
}

export interface ComponentTemplate {
  type: 'text' | 'image' | 'button' | 'container';
  label: string;
  icon: string;
  defaultStyles: Partial<BuilderElement['styles']>;
  defaultContent?: string;
}
