import React from 'react';
import { DragSource, DragSourceMonitor, DragSourceConnector, ConnectDragSource } from 'react-dnd';
import { ItemTypes } from './dnd/constants';

type Props = {
  children: any;
  registeredWidgetId: any;
};

const widgetSource = {
  beginDrag(props: Props) {
    return {
      registeredWidgetId: props.registeredWidgetId
    };
  }
};

const collect = (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
  connectDragSource: connect.dragSource()
});

type DragAndDropProps = {
  connectDragSource: ConnectDragSource;
};

const connectToReactTabWidget = (WidgetLinkComponent: any) =>
  DragSource(ItemTypes.WIDGET, widgetSource, collect)(
    ({ connectDragSource, children }: Props & DragAndDropProps) => (
      <div ref={(instance: any) => connectDragSource(instance)}>
        <WidgetLinkComponent>{children}</WidgetLinkComponent>
      </div>
    )
  );

export default connectToReactTabWidget;
