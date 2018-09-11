import React from 'react';
import styled from 'styled-components';
import { Provider, Container, connectToReactTabWidget } from '../ReactTabWidget';
import { registeredWidgets } from './widgets';

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

const getWidgetName = (widgetId: any) => registeredWidgets[widgetId].name;
const getWidgetRenderedComponent = (widgetId: any) => {
  const { Component } = registeredWidgets[widgetId];

  return <Component />;
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
      />
    </Wrapper>
  </Provider>
);
