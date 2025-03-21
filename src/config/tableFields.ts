import { Field, SelectOption } from '@/components/common/dataTableComponent';
import { Product } from '@/types/product/types';
import { Model } from '@/types/model/types';
import { Customer } from '@/types/customer/types';
import { Tier } from '@/types/tier/types';
import { ActionLog } from '@/types/action-log/types';
import { User } from '@/types/user/types';
import { Order } from '@/types/order/types';

export const productFields: Field<Product>[] = [
  { name: 'ID', key: 'id', type: 'text' },
  { name: 'Name', key: 'name', type: 'text' },
  { name: 'Price', key: 'price', type: 'number' },
  { name: 'Stock', key: 'stock', type: 'number' },
  { name: 'Is virtual', key: 'isVirtual', type: 'boolean' },
  { name: 'Image', key: 'imageUrl', type: 'image' },
  { name: 'Is show', key: 'isShow', type: 'boolean' },
];

export const modelFields: Field<Model>[] = [
  { name: 'Name', key: 'name', type: 'text' },
  { name: 'API Url', key: 'apiUrl', type: 'text' },
  { name: 'Is default', key: 'isDefault', type: 'boolean' },
  { name: 'Is show', key: 'isShow', type: 'boolean' },
];

const customerStatusOptions: SelectOption[] = [
  {
    key: 0,
    value: 'Active',
    color: { background: 'bg-green-100', text: 'text-green-700' },
  },
  {
    key: 1,
    value: 'Inactive',
    color: { background: 'bg-amber-100', text: 'text-amber-700' },
  },
  {
    key: 2,
    value: 'Banned',
    color: { background: 'bg-red-100', text: 'text-red-700' },
  },
];

export const customerFields: Field<Customer>[] = [
  { name: 'ID', key: 'id', type: 'text' },
  { name: 'First Name', key: 'firstName', type: 'text' },
  { name: 'Last Name', key: 'lastName', type: 'text' },
  { name: 'Email', key: 'email', type: 'text' },
  { name: 'Country Code', key: 'countryCode', type: 'text' },
  { name: 'Phone', key: 'phone', type: 'text' },
  {
    name: 'Status',
    key: 'status',
    type: 'select',
    option: customerStatusOptions,
  },
];

export const tierFields: Field<Tier>[] = [
  { name: 'Name', key: 'name', type: 'text' },
  { name: 'Required points', key: 'requiredPoints', type: 'number' },
];

export const actionLogFields: Field<ActionLog>[] = [
  { name: 'ID', key: 'id', type: 'text' },
  { name: 'User', key: 'user', type: 'object', label: 'username' },
  { name: 'Action', key: 'action', type: 'text' },
  { name: 'Timestamp', key: 'timestamp', type: 'date', format: 'MM-DD-YYYY HH:mm:ss' },
  { name: 'Is error', key: 'isError', type: 'boolean' },
];

export const userFields: Field<User>[] = [
  { name: 'ID', key: 'id', type: 'text' },
  { name: 'Email', key: 'email', type: 'text' },
  { name: 'First Name', key: 'firstName', type: 'text' },
  { name: 'Last Name', key: 'lastName', type: 'text' },
  { name: 'Username', key: 'username', type: 'text' },
  { name: 'Role', key: 'role', type: 'object', label: 'name' },
];

export const orderFields: Field<Order>[] = [
  { name: 'ID', key: 'id', type: 'text' },
  { name: 'Customer email', key: 'customer', type: 'object', label: 'email' },
  { name: 'Original total', key: 'originalTotal', type: 'number', prefix: '$' },
  { name: 'Total', key: 'total', type: 'number', prefix: '$' },
  { name: 'Tax', key: 'tax', type: 'number', prefix: '$' },
  { name: 'Shipping fee', key: 'shippingFee', type: 'number', prefix: '$' },
  { name: 'Points earned', key: 'pointsEarned', type: 'number'},
  { name: 'Order status', key: 'status', type: 'text', textCase: 'capitalize' },
  { name: 'Payment status', key: 'payment', type: 'object', label: 'status', textCase: 'capitalize' },
];
