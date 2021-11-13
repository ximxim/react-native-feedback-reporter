import type { ReactNode, RefObject } from 'react';

export type anchorType =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left';

export interface IPopoverStylePayload extends IPopoverState {
  bubbleHeight: number;
  bubbleWidth?: number;
}

export interface IModalToggleProps {
  onShow?: (isModalOpen: boolean) => void;
}
export interface IOpenPopoverParams
  extends IModalToggleProps,
    IPopoverSharedProps {
  ref?: RefObject<unknown>;
  timeout?: number;
  bubbleWidth?: number;
}

export interface IPopoverSharedProps {
  anchor: anchorType;
  component: ReactNode;
  onDismissAsync?: (isModalOpen: boolean) => Promise<void>;
}
export interface IPopoverState extends IPopoverSharedProps {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface IPopoverContext {
  openPopover: (openPopover: IOpenPopoverParams) => void;
}

export interface IPopoverProviderProps {
  children: ReactNode;
}
