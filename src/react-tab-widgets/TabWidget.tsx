import React from 'react';
import uuid from 'uuid/v4';
import Draggable from 'react-draggable';
import { Position } from './types';
import { Container, Layout, Separator, Widget, WidgetTabs, Dropzones } from './components';
import { WidgetTab, WidgetTabDropzone, Dropzone, WidgetLastTabDropzone } from './dnd';
import debounce from 'lodash/debounce';

const ROOT = 'root';
const BORDER_SIZE = 4;

type StateProps = {
  structure?: any;
  widgets?: any;
  activeTabs?: any;
  getWidgetName: any;
  getWidgetRenderedComponent: any;
};

type ActionProps = {
  onChangeWidth: any;
  onChangeHeight: any;
  onCreateWidget: any;
  onRemoveWidget: any;
  onAddWidget: any;
  onAddWidgetToTab: any;
  onChangeActiveTab: any;
};

class Advanced extends React.Component<StateProps & ActionProps> {
  private layout: any;
  private createReactRef = (instance: any) => (this.layout = instance);
  public state = {
    width: 0,
    height: 0
  };

  private createOnDragStop = (
    prevId: number,
    nextId: number,
    prevPercent: number,
    nextPercent: number,
    nextValue: number,
    isVertical: boolean
  ) => (e: any, { x, y }: any) => {
    const offset: number = isVertical ? x : y;

    let newNextPercent = Math.trunc(((nextValue - offset) * nextPercent) / nextValue);
    if (newNextPercent < 10) {
      newNextPercent = 10;
    } else if (newNextPercent > prevPercent + nextPercent - 10) {
      newNextPercent = prevPercent + nextPercent - 10;
    }
    const newPrevPercent = prevPercent + nextPercent - newNextPercent;

    if (isVertical) {
      this.props.onChangeWidth(prevId, newPrevPercent, nextId, newNextPercent);
    } else {
      this.props.onChangeHeight(prevId, newPrevPercent, nextId, newNextPercent);
    }
  };

  private createOnTabDrop = (containerId: any, nextWidget?: any) => ({
    widgetId,
    registeredWidgetId
  }: any) => {
    let _widgetId = widgetId;
    if (!_widgetId) {
      _widgetId = uuid();
      this.props.onCreateWidget(_widgetId, registeredWidgetId);
    } else {
      this.props.onRemoveWidget(_widgetId);
    }

    this.props.onAddWidgetToTab(containerId, nextWidget, _widgetId);
  };

  private createOnContainerDrop = (containerId: any, position?: any) => ({
    widgetId,
    registeredWidgetId
  }: any) => {
    let _widgetId = widgetId;
    if (!_widgetId) {
      _widgetId = uuid();
      this.props.onCreateWidget(_widgetId, registeredWidgetId);
    } else {
      this.props.onRemoveWidget(_widgetId);
    }

    this.props.onAddWidget(containerId, position, _widgetId);
  };

  private createOnClose = (widgetId: any) => () => {
    this.props.onRemoveWidget(widgetId);
  };

  private createOnClick = (containerId: any, widgetId: any) => () => {
    this.props.onChangeActiveTab(containerId, widgetId);
  };

  private renderContainer = (containerId: any, width: number, height: number): any => {
    const { structure } = this.props;
    const container = structure[containerId];
    const isVertical = container.isVertical;
    const hasWidgets = !!container.widgets;
    const hasContainers = !!container.containers;

    return (
      <Container
        containerWidth={width}
        containerHeight={height}
        key={containerId}
        isVertical={isVertical}
        hasWidgets={hasWidgets}
      >
        {hasContainers &&
          this.renderContainers(container.containers, isVertical, width, height, containerId)}
        {hasWidgets && this.renderTabs(containerId, container.widgets)}
        {hasWidgets && this.renderActiveWidget(containerId)}
        {hasWidgets &&
          width > 100 &&
          height > 100 && (
            <Dropzones dropzoneWidth={width}>
              {this.renderDropzones(containerId, width, height)}
            </Dropzones>
          )}
      </Container>
    );
  };

  private renderContainers = (
    containers: any[],
    isVertical: boolean,
    width: number,
    height: number,
    containerId: any
  ) => {
    const { structure } = this.props;

    return containers.reduce((current: any, id: any, index: number, ids: any[]) => {
      const item = structure[id];

      const calculatedWidth: number =
        (width - (isVertical ? (ids.length - 1) * BORDER_SIZE : 0)) * ((item.width || 100) / 100);
      const calculatedHeight: number =
        (height - (!isVertical ? (ids.length - 1) * BORDER_SIZE : 0)) *
        ((item.height || 100) / 100);

      if (index !== 0) {
        const prevId = ids[index - 1];
        const prevPercent = isVertical ? structure[prevId].width : structure[prevId].height;
        const nextPercent = isVertical ? item.width : item.height;
        const nextValue = isVertical ? calculatedWidth : calculatedHeight;

        current.push(
          <Draggable
            bounds="parent"
            key={`separator_${containerId}_${index}`}
            position={{ x: 0, y: 0 }}
            onStop={this.createOnDragStop(
              prevId,
              id,
              prevPercent,
              nextPercent,
              nextValue,
              isVertical
            )}
          >
            <Separator isVertical={isVertical} />
          </Draggable>
        );
      }

      current.push(this.renderContainer(id, calculatedWidth, calculatedHeight));
      return current;
    }, []);
  };

  private renderTabs = (containerId: any, widgets: any[]) => (
    <WidgetTabs>
      {widgets.map((item, index) => (
        <WidgetTab
          containerId={containerId}
          isLastTab={index === widgets.length - 1}
          isLonelyTab={widgets.length === 1}
          key={item}
          widgetId={item}
          onClose={this.createOnClose(item)}
          isActive={this.props.activeTabs[containerId] === item}
          onClick={this.createOnClick(containerId, item)}
        >
          {this.props.getWidgetName(item)}
          <WidgetTabDropzone
            onTabDrop={this.createOnTabDrop(containerId, item)}
            widgetId={item}
            containerId={containerId}
          />
        </WidgetTab>
      ))}
      <WidgetLastTabDropzone
        containerId={containerId}
        onTabDrop={this.createOnTabDrop(containerId)}
      />
    </WidgetTabs>
  );

  private renderActiveWidget = (containerId: any) => {
    const { activeTabs, getWidgetRenderedComponent } = this.props;

    return <Widget>{getWidgetRenderedComponent(activeTabs[containerId])}</Widget>;
  };

  private renderDropzones = (containerId: any, width: number, height: number) => {
    const positions: Position[] = ['bottom', 'top', 'left', 'right'];

    return (
      <React.Fragment>
        {positions.map(position => {
          const isRoot = containerId === 'root';
          const dropzoneWidth =
            position === 'left' || position === 'right'
              ? isRoot
                ? 16
                : Math.trunc(width / 4)
              : width;
          const dropzoneHeight =
            position === 'top' || position === 'bottom'
              ? isRoot
                ? 16
                : Math.trunc(height / 2)
              : height;
          return (
            <Dropzone
              key={position}
              containerId={containerId}
              onContainerDrop={this.createOnContainerDrop(containerId, position)}
              position={position}
              dropzoneWidth={dropzoneWidth}
              dropzoneHeight={dropzoneHeight}
              zIndex={isRoot ? 101 : 100}
            />
          );
        })}
      </React.Fragment>
    );
  };

  public render() {
    const { width, height } = this.state;
    const sizeCalculated = !!width && !!height;
    const hasContainers = this.props.structure.root.containers.length > 0;

    return (
      <Layout innerRef={this.createReactRef}>
        {sizeCalculated && (
          <React.Fragment>
            {hasContainers && (
              <React.Fragment>
                {this.renderDropzones(ROOT, width, height)}
                {this.renderContainer(ROOT, width, height)}
              </React.Fragment>
            )}
            {!hasContainers && (
              <Dropzone
                containerId={ROOT}
                onContainerDrop={this.createOnContainerDrop(ROOT, 'center')}
                position="center"
                dropzoneWidth={width}
                dropzoneHeight={height}
              />
            )}
          </React.Fragment>
        )}
      </Layout>
    );
  }

  public componentDidMount() {
    this.setState({
      width: this.layout.offsetWidth,
      height: this.layout.offsetHeight
    });

    window.onresize = debounce(
      () =>
        this.setState({
          width: this.layout.offsetWidth,
          height: this.layout.offsetHeight
        }),
      50
    );
  }
}

export default Advanced;
