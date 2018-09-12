import React from 'react';
import styled from 'styled-components';
import uuid from 'uuid/v4';
import { Provider, Container, connectToReactTabWidget } from '../react-tab-widgets';
import { registeredWidgets } from './widgets';

const containerRegistered: any = {};

export const Wrapper = styled.div`
  display: flex;
  height: 600px;
`;

export const Widgets = styled.div`
  width: 15rem;
  height: 100%;
  background: aquamarine;
  & > div {
    margin: 0.5rem;
  }
`;

const Link = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 1rem 2rem;
`;

const WidgetLink = connectToReactTabWidget(({ children }: any) => <Link>{children}</Link>);

const getWidgetName = (widgetId: any) =>
  registeredWidgets[containerRegistered[widgetId].registeredWidgetId].name;

const getWidgetRenderedComponent = (widgetId: any) => {
  const { registeredWidgetId, props } = containerRegistered[widgetId];

  const { Component } = registeredWidgets[registeredWidgetId];

  return <Component {...props} />;
};

const registerNewWidget = (widgetId: string, registeredWidgetId: string) => {
  const idProp = uuid();

  containerRegistered[widgetId] = {
    props: {
      id: idProp
    },
    registeredWidgetId
  };
};

export default () => (
  <Provider>
    <Wrapper>
      <Widgets>
        {Object.keys(registeredWidgets).map(item => (
          <WidgetLink key={item} registeredWidgetId={item}>
            {registeredWidgets[item].name}
          </WidgetLink>
        ))}
      </Widgets>
      <Container
        getWidgetName={getWidgetName}
        getWidgetRenderedComponent={getWidgetRenderedComponent}
        onWidgetCreated={registerNewWidget}
      />
    </Wrapper>
  </Provider>
);
