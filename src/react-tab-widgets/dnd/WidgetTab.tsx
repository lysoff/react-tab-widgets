import React, { Component } from 'react';
import {
  DragSource,
  DragSourceMonitor,
  DragSourceConnector,
  ConnectDragSource,
  ConnectDragPreview
} from 'react-dnd';
import { ItemTypes } from './constants';
import { WidgetTab as WidgetTabComponent, Cancel } from '../components';

type Props = {
  children: any;
  widgetId: any;
  onClose: any;
  containerId: any;
  isLastTab: boolean;
  isLonelyTab: boolean;
  isActive: boolean;
  onClick: any;
};

const widgetTabSource = {
  beginDrag(props: Props) {
    return {
      widgetId: props.widgetId,
      isLastTab: props.isLastTab,
      isLonelyTab: props.isLonelyTab,
      containerId: props.containerId
    };
  }
};

const collect = (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview()
});

type DragAndDropProps = {
  connectDragSource: ConnectDragSource;
  connectDragPreview: ConnectDragPreview;
};

class WidgetTab extends Component<Props & DragAndDropProps> {
  private handleClick = () => {
    this.props.onClose();
  };

  public render() {
    const {
      connectDragSource,
      connectDragPreview,
      onClick,
      onClose,
      children,
      ...props
    } = this.props;

    /* tslint:disable:jsx-no-lambda */
    return (
      <WidgetTabComponent
        onClick={onClick}
        {...props}
        innerRef={(instance: any) => connectDragSource(instance)}
      >
        {children}
        <Cancel onClick={this.handleClick}>✖️</Cancel>
      </WidgetTabComponent>
    );
    /* tslint:enable:jsx-no-lambda */
  }
}

export default DragSource(ItemTypes.WIDGET_TAB, widgetTabSource, collect)(WidgetTab);
