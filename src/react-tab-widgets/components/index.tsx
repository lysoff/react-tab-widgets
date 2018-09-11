import styled, { css } from 'styled-components';

export const Layout = styled<any, any>('div')`
  position: relative;
  height: 100%;
  width: 100%;
`;

type WidgetTabProps = {
  isActive: boolean;
};

export const WidgetTab = styled<WidgetTabProps, any>('div')`
  border-bottom: 2px solid;
  padding: 0.5rem 2rem;
  white-space: nowrap;
  position: relative;
  font-size: 0.6rem;
  z-index: 102;
  cursor: pointer;
  color: ${props => (props.isActive ? '#000' : '#666')};
  border-color: ${props => (props.isActive ? '#9999de' : '#ccc')};
  font-weight: ${props => (props.isActive ? 'bold' : 'normal')};
`;

export const Widget = styled<any, any>('div')`
  position: relative;
  z-index: 0;
  width: 100%;
  height: 100%;
`;

export const WidgetTabs = styled<any, any>('div')`
  height: 1.8rem;
  display: flex;

  ${WidgetTab} {
    margin-right: 0.5rem;
  }
`;

export const Cancel = styled<any, any>('div')`
  position: absolute;
  height: 0.6rem;
  width: 0.6rem;
  background-size: cover;
  cursor: pointer;
  font-size: 0.8rem;
  right: 0.2rem;
  top: calc(50% - 0.6rem);
`;

export type WidgetTabDropzoneProps = {
  isVisible: boolean;
  isOver: boolean;
  canDrop: boolean;
};

export const WidgetTabDropzone = styled<WidgetTabDropzoneProps, any>('div')`
  position: absolute;
  height: 1.8rem;
  width: 100%;
  display: ${props => (props.isVisible ? 'block' : 'none')};
  background: ${props =>
    props.isOver && props.canDrop ? 'rgba(200, 200, 200, 0.3)' : 'transparent'};
  top: 0;
  left: 0;
`;

export const WidgetLastTabDropzone = styled<WidgetTabDropzoneProps, any>('div')`
  height: 1.8rem;
  display: ${props => (props.isVisible ? 'block' : 'none')};
  background: ${props =>
    props.isOver && props.canDrop ? 'rgba(200, 200, 200, 0.3)' : 'transparent'};
  width: 100%;
`;

type ContainerProps = {
  containerWidth: number;
  containerHeight: number;
  isVertical: boolean;
  hasWidgets: boolean;
};

export const Container = styled<ContainerProps, any>('div')`
  transition: any 1s;
  position: relative;
  padding: 0;
  overflow: hidden;
  display: ${props => (props.hasWidgets ? 'block' : 'flex')};
  width: ${props => props.containerWidth || '0'}px;
  height: ${props => props.containerHeight || '0'}px;
  flex-direction: ${props => (props.isVertical ? 'row' : 'column')};
  background: white;
`;

export const Separator = styled<any, any>('div')`
  background: rgba(255, 255, 255, 0.5);
  z-index: 100;
  ${props =>
    props.isVertical
      ? css`
          cursor: col-resize;
          height: 100%;
          width: 0.25rem;
        `
      : css`
          cursor: row-resize;
          height: 0.25rem;
          width: 100%;
        `};
`;

export type DropzonesProps = {
  dropzoneWidth: number;
};

export const Dropzones = styled<DropzonesProps, any>('div')`
  position: absolute;
  top: 1.8rem;
  height: calc(100% - 1.8rem);
  width: ${props => props.dropzoneWidth}px;
`;

export type DropzoneProps = {
  dropzoneWidth: number;
  dropzoneHeight: number;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  zIndex: number;
  isVisible: boolean;
  isOver: boolean;
  canDrop: boolean;
};

export const Dropzone = styled<DropzoneProps, any>('div')`
  display: ${props => (props.isVisible ? 'block' : 'none')};
  background: ${props =>
    props.isOver && props.canDrop ? 'rgba(200, 200, 200, 0.3)' : 'transparent'};
  position: absolute;
  width: ${props => props.dropzoneWidth}px;
  height: ${props => props.dropzoneHeight}px;
  z-index: ${props => props.zIndex};
  ${props => {
    switch (props.position) {
      case 'left':
        return css`
          left: 0;
        `;
      case 'right':
        return css`
          right: 0;
        `;
      case 'bottom':
        return css`
          bottom: 0;
        `;
      case 'top':
        return css`
          top: 0;
        `;
      default:
        return css`
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
        `;
    }
  }};
`;
