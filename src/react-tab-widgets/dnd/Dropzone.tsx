import React, { Component } from 'react';
import { DropTarget, DropTargetConnector, DropTargetMonitor, ConnectDropTarget } from 'react-dnd';
import { Dropzone as DropzoneComponent, DropzoneProps } from '../components';
import { ItemTypes } from './constants';

type Props = {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  isVisible: boolean;
  onContainerDrop: any;
  containerId: any;
};

const containerTarget = {
  drop(props: any, monitor: DropTargetMonitor) {
    const item = monitor.getItem();
    props.onContainerDrop(item);
  },
  canDrop(props: any, monitor: DropTargetMonitor) {
    const item = monitor.getItem();
    return !item.widgetId || !item.isLonelyTab || item.containerId !== props.containerId;
  }
};

const collect = (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
  connectDropTarget: connect.dropTarget(),
  isVisible: !!monitor.getItem(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

class Dropzone extends Component<Props & DropzoneProps> {
  public render() {
    const { connectDropTarget, ...props } = this.props;
    /* tslint:disable:jsx-no-lambda */
    return (
      <DropzoneComponent {...props} innerRef={(instance: any) => connectDropTarget(instance)} />
    );
    /* tslint:enable:jsx-no-lambda */
  }
}

export default DropTarget([ItemTypes.WIDGET, ItemTypes.WIDGET_TAB], containerTarget, collect)(
  Dropzone
);
