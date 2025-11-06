export type ElementType =
  | 'text'
  | 'image'
  | 'button'
  | 'container'
  | 'form'
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'label';

export interface FormAttributes {
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  value?: string;
  inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
  options?: { label: string; value: string }[]; // For select, radio
  checked?: boolean; // For checkbox, radio
  rows?: number; // For textarea
  cols?: number; // For textarea
  min?: number;
  max?: number;
  pattern?: string;
  labelFor?: string; // For label
}

export interface BuilderElement {
  id: string;
  type: ElementType;
  content?: string;
  formAttributes?: FormAttributes;
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
  type: ElementType;
  label: string;
  icon: string;
  category: 'basic' | 'form';
  defaultStyles: Partial<BuilderElement['styles']>;
  defaultContent?: string;
  defaultFormAttributes?: FormAttributes;
}
