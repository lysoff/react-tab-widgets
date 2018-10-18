# React Tab Widgets

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
    {/* nest draggable widgets and Container here */}
  </Provider>
);
``` 

### Container

`Container` is a Layout which contains all widgets. `Container` as a set of multiple dropzones and draggable tabs should be nested within `Provider`. Container has no `children` property.
 `Container` properties:
 - `getWidgetName` - `(widgetId: string) => string`. Function that returns widget name by given `widgetId` that would be displayed on a tab.
 - `getWidgetRenderedComponent` - `(widgetId: string) => React.Node`. Function that returns React.Node by given `widgetId`
 - `onWidgetCreated` - `(widgetId: string, registeredWidgetId: string) => void`. Event handler for new widget being created. `widgetId` is a new `uuid/v4` identifier that's generated under the hood (identifier creation would be extracted from hardcode in next minor version), `registeredWidgetId` - consider it as a widget type which was provided by draggable widget from outside (here and below, "registered" means registered as a type).

```typescript
<Container
  getWidgetName={getWidgetName}
  getWidgetRenderedComponent={getWidgetRenderedComponent}
  onWidgetCreated={registerNewWidget}
/>
```

### connectToReactTabWidget

HOC which provides `registeredWidgetId` prop handling. This `registeredWidgetId` would be passed to `Container`'s `onWidgetCreated` callback.

Let's imagine we have a pallete of registered widgets to add. So, we need draggable link that our `Container` is able to handle. To create draggable link component we use `connectToReactTabWidget`:
```typescript
const WidgetLink = connectToReactTabWidget(({ children }: any) => <Link>{children}</Link>);

// rendering somewhere inside `Provider`
<WidgetLink registeredWidgetId="xxx-xxxx-xxxxx">Drag me to `Container`</WidgetLink>
```

## Concepts

`react-tab-widgets` is just a dashboard that provides all the drag-n-drop magic. To use it you should be able to identify a widget type by `registeredWidgetId` and render a component by `widgetId`.
Future version will be able to handle `initialStructure` as well.
