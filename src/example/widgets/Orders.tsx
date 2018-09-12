import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #28d094;
  opacity: 0.2;
`;

type Props = {
  children: any;
  id: any;
};

export default class OrderHistory extends React.Component<Props> {
  public componentDidMount() {
    console.log('Orders mounted', this.props.id);
  }
  public render() {
    return <Wrapper>{this.props.children}</Wrapper>;
  }
}
