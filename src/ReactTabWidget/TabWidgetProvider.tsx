import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

export default DragDropContext(HTML5Backend)(({ children }: any) => (
  <React.Fragment>{children}</React.Fragment>
));
