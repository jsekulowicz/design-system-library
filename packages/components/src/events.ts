export interface ValueChangeDetail<Value = string> {
  value: Value;
}

export interface ValuesChangeDetail {
  values: string[];
}

export type SelectionChangeDetail = ValueChangeDetail | ValuesChangeDetail;

export interface CheckedChangeDetail {
  checked: boolean;
}

export interface SearchDetail {
  query: string;
}

export interface OverflowClickDetail {
  count: number;
}

export interface ClickDetail {
  originalEvent: MouseEvent;
}

export interface ActivateDetail {
  value: string;
  originalEvent: Event;
}

export interface DialogCloseDetail {
  returnValue: string;
}
