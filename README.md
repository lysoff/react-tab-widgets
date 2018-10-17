# React Tab Widgets system

If you are dealing with application that consists of widgets that might be switched on/off depending on user's preference, you'd probably try `react-tab-widgets` which provides Layout with draggable tabs and resizable areas.

## Installing

```
$ npm install react-tab-widgets
```
or
```
$ yarn add react-tab-widgets
```

## Usage

### Provider

`react-widget-tabs` library uses `react-dnd` under the hood, so all draggable objects and dropzones must be inside one drag-n-drop context which is provided by `Provider`:

```typescript
import { Provider } from 'react-tab-widgets';

...

export default () => (
  <Provider>
    ... 
  </Provider>
);
``` 

### Container

`Container` is a Layout which contains all widgets. `Container` as a set of multiple dropzones and draggable tabs should be nested within `Provider`.
 `Container` properties:
 - `getWidgetName` - `(widgetId: string) => string`. Function that returns widget name by given `widgetId` that would be displayed on a tab.
 - `getWidgetRenderedComponent` - `(widgetId: string) => React.Node`. Function that returns React.Node by given `widgetId`

WIP
