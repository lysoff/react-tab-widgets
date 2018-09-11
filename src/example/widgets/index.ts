import uuid from 'uuid/v4';
import Chart from './Chart';
import Orders from './Orders';
import OrderHistory from './OrderHistory';

export const registeredWidgets = {};

export const register = (name: string, Component: any) => {
  const id = uuid();
  registeredWidgets[id] = {
    name,
    Component
  };
};

register('Chart', Chart);
register('Orders', Orders);
register('OrderHistory', OrderHistory);
