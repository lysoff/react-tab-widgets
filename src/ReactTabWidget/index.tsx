import React from 'react';
import TabWidget from './TabWidget';
import update from 'immutability-helper';
import uuid from 'uuid/v4';
import { Container, Position } from './types';

type Props = {
  getWidgetName: any;
  getWidgetRenderedComponent: any;
};

type State = {
  structure: any;
  widgets: any;
  activeTabs: any;
};

export default class ReactTabWidgetContainer extends React.Component<Props, State> {
  public state = {
    widgets: {},
    activeTabs: {},
    structure: {
      root: {
        isVertical: true,
        containers: []
      }
    }
  };

  private normalize = (
    structure: { [key in keyof any]: Container }
  ): { [key in keyof any]: Container } => {
    const normalized = {};
    const ratios = {};

    const normalizeContainer = (id: any) => {
      const { containers, ...container }: any = { ...structure[id] };

      if (containers) {
        container.containers = [...containers];

        for (let i = 0; i < container.containers.length; ) {
          const childId = container.containers[i];
          const child: Container = { ...structure[childId] };

          if (container.isVertical === child.isVertical && !!child.containers) {
            container.containers.splice(i, 1, ...child.containers);

            const field: any = container.isVertical ? 'width' : 'height';

            // memoize ratios to calculate nested containers size
            child.containers.forEach(item => {
              ratios[item] = ratios[childId]
                ? (child[field] * ratios[childId]) / 100
                : child[field];
            });
          } else {
            i++;
          }
        }

        container.containers.forEach(normalizeContainer);
      }
      normalized[id] = container;
    };

    normalizeContainer('root');

    // calculate actual sizes considering ratio
    Object.keys(normalized).forEach(key => {
      if (!ratios[key]) {
        return;
      }

      const field = normalized[key].height ? 'height' : 'width';
      normalized[key][field] = Math.trunc((normalized[key][field] * ratios[key]) / 100);
    });

    // calculate first container's size (remainder to fill 100)
    Object.keys(normalized).forEach(key => {
      if ((normalized[key].containers || []).length === 0) {
        return;
      }

      const field = normalized[key].isVertical ? 'width' : 'height';
      const sum = normalized[key].containers.reduce((current: any, item: any, index: number) => {
        if (index === 0) {
          return current;
        }
        return current + normalized[item][field];
      }, 0);

      normalized[normalized[key].containers[0]][field] = 100 - sum;
    });

    return normalized;
  };

  private changeWidth = (prevId: number, prevValue: number, nextId: number, nextValue: number) => {
    this.setState((state: State) => {
      return update(state, {
        structure: {
          [prevId]: {
            width: {
              $set: prevValue
            }
          },
          [nextId]: {
            width: {
              $set: nextValue
            }
          }
        }
      });
    });
  };

  private changeHeight = (prevId: number, prevValue: number, nextId: number, nextValue: number) => {
    this.setState((state: State) => {
      return update(state, {
        structure: {
          [prevId]: {
            height: {
              $set: prevValue
            }
          },
          [nextId]: {
            height: {
              $set: nextValue
            }
          }
        }
      });
    });
  };

  private createWidget = (widgetId: string, registeredWidgetId: string) => {
    this.setState((state: State) =>
      update(state, {
        widgets: {
          [widgetId]: {
            $set: {
              widget: registeredWidgetId,
              props: {
                newWidget: true
              }
            }
          }
        }
      })
    );
  };

  private removeWidget = (widgetId: any) => {
    this.setState((state: State) => {
      const id = Object.keys(state.structure).find(
        key => (state.structure[key].widgets || []).indexOf(widgetId) !== -1
      ) as string;

      const widgets = (state.structure[id].widgets || []).filter((item: any) => item !== widgetId);

      if (widgets.length > 0) {
        const structure = this.normalize(
          update(state.structure, {
            [id]: {
              widgets: {
                $set: widgets
              }
            }
          })
        );

        const activeTab =
          widgetId === state.activeTabs[id]
            ? (state.structure[id].widgets || [])[0]
            : state.activeTabs[id];

        return update(state, {
          structure: {
            $set: structure
          },
          activeTabs: {
            [id]: {
              $set: activeTab
            }
          }
        });
      }

      const findContainer = (child: any) =>
        Object.keys(state.structure).find(
          key => (state.structure[key].containers || []).indexOf(child) !== -1
        ) as string;

      let containerId: string = findContainer(id);
      let childId: string = id;

      while (
        containerId !== 'root' &&
        (state.structure[containerId].containers || []).length === 1
      ) {
        childId = containerId;
        containerId = findContainer(containerId);
      }

      return {
        ...state,
        structure: this.normalize(
          update(state.structure, {
            [containerId]: {
              containers: {
                $apply: (value: any[]) => value.filter(item => item !== childId)
              }
            }
          })
        )
      };
    });
  };

  private addWidget = (containerId: any, position: Position, widgetId: string) => {
    this.setState((state: State) => {
      const isVertical = position === 'left' || position === 'right';

      const newContainerId = uuid();

      const newContainer = {
        widgets: [widgetId],
        [isVertical ? 'width' : 'height']: 50
      };

      if (position === 'center') {
        newContainer[isVertical ? 'width' : 'height'] = 100;

        return update(state, {
          structure: {
            [containerId]: {
              $set: {
                isVertical,
                containers: [newContainerId]
              }
            },
            [newContainerId]: {
              $set: newContainer
            }
          },
          activeTabs: {
            [newContainerId]: {
              $set: widgetId
            }
          }
        });
      }

      const oldContainerId = uuid();

      const oldContainer = {
        ...state.structure[containerId],
        [isVertical ? 'width' : 'height']: 50,
        [isVertical ? 'height' : 'width']: undefined
      };

      const containers =
        position === 'left' || position === 'top'
          ? [newContainerId, oldContainerId]
          : [oldContainerId, newContainerId];

      const structure = this.normalize(
        update(state.structure, {
          [containerId]: {
            $set: {
              width: state.structure[containerId].width,
              height: state.structure[containerId].height,
              isVertical,
              containers
            }
          },
          [newContainerId]: {
            $set: newContainer
          },
          [oldContainerId]: {
            $set: oldContainer
          }
        })
      );
      return update(state, {
        structure: {
          $set: structure
        },
        activeTabs: {
          [newContainerId]: { $set: widgetId },
          [oldContainerId]: {
            $set: state.activeTabs[containerId]
          }
        }
      });
    });
  };

  private addWidgetToTab = (containerId: any, nextWidgetId: number, widgetId: string) => {
    this.setState((state: State) => {
      const widgets = state.structure[containerId].widgets || [];

      const indexToInsert = nextWidgetId ? widgets.indexOf(nextWidgetId) : widgets.length;

      return update(state, {
        structure: {
          [containerId]: {
            widgets: {
              $apply: (values: any[]) => {
                const newValues = [...values];
                newValues.splice(indexToInsert, 0, widgetId);
                return newValues;
              }
            }
          }
        },
        activeTabs: {
          [containerId]: {
            $set: widgetId
          }
        }
      });
    });
  };

  private changeActiveTab = (containerId: any, widgetId: any) => {
    this.setState((state: State) => {
      return update(state, {
        activeTabs: {
          [containerId]: {
            $set: widgetId
          }
        }
      });
    });
  };

  public render() {
    const { structure, widgets, activeTabs } = this.state;
    const { getWidgetName, getWidgetRenderedComponent } = this.props;
    return (
      <TabWidget
        getWidgetName={getWidgetName}
        getWidgetRenderedComponent={getWidgetRenderedComponent}
        structure={structure}
        widgets={widgets}
        activeTabs={activeTabs}
        onChangeHeight={this.changeHeight}
        onChangeWidth={this.changeWidth}
        onCreateWidget={this.createWidget}
        onRemoveWidget={this.removeWidget}
        onAddWidget={this.addWidget}
        onAddWidgetToTab={this.addWidgetToTab}
        onChangeActiveTab={this.changeActiveTab}
      />
    );
  }
}
