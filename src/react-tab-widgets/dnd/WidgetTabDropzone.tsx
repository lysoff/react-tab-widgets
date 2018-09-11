import React, { Component } from 'react';
import { WidgetTabDropzone as WidgetTabDropzoneComponent, DropzoneProps } from '../components';
import { ItemTypes } from './constants';
import { DropTarget, DropTargetConnector, DropTargetMonitor, ConnectDropTarget } from 'react-dnd';

type Props = {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
  canDrop: boolean;
  isVisible: boolean;
  onTabDrop: any;
  widgetId: any;
  containerId: any;
};

const containerTarget = {
  drop(props: any, monitor: DropTargetMonitor) {
    const item = monitor.getItem();
    props.onTabDrop(item);
  },
  canDrop(props: any, monitor: DropTargetMonitor) {
    const item = monitor.getItem();

    return props.widgetId !== item.widgetId;
  }
};

const collect = (connect: DropTargetConnector, monitor: DropTargetMonitor) => ({
  connectDropTarget: connect.dropTarget(),
  isVisible: !!monitor.getItem(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

class WidgetTabDropzone extends Component<Props & DropzoneProps> {
  public render() {
    const { connectDropTarget, ...props } = this.props;
    /* tslint:disable:jsx-no-lambda */
    return (
      <WidgetTabDropzoneComponent
        {...props}
        innerRef={(instance: any) => connectDropTarget(instance)}
      />
    );
    /* tslint:enable:jsx-no-lambda */
  }
}

export default DropTarget([ItemTypes.WIDGET, ItemTypes.WIDGET_TAB], containerTarget, collect)(
  WidgetTabDropzone
);
