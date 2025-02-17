import {
  faHome,
  faUser,
  faGear,
  faBox,
  faUserTie,
  faShop,
  faUsersRectangle,
  faBrain,
  faCalendarCheck,
  faUsersGear
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface NavigationItem {
  name: string;
  key: string;
  href: string;
  icon: IconDefinition;
  permission?: string[];
}

const navigation: NavigationItem[] = [
  {
    'name': 'Dashboard',
    'key': 'dashboard',
    'href': '/',
    'icon': faHome,
  },
  {
    'name': 'Order',
    'key': 'order',
    'href': '/order',
    'icon': faShop,
    'permission': ['order:read'],
  },
  {
    'name': 'Products',
    'key': 'product',
    'href': '/product',
    'icon': faBox,
    'permission': ['product:read'],
  },
  {
    'name': 'Customer',
    'key': 'customer',
    'href': '/customer',
    'icon': faUser,
    'permission': ['customer:read'],
  },
  {
    'name': 'Tier',
    'key': 'tier',
    'href': '/tier',
    'icon': faUsersRectangle,
    'permission': ['tier:read'],
  },
  {
    'name': 'User',
    'key': 'user',
    'href': '/user',
    'icon': faUserTie,
    'permission': ['user:read'],
  },
  {
    'name': 'Role',
    'key': 'role',
    'href': '/role',
    'icon': faUsersGear,
    'permission': ['role:read'],
  },
  {
    'name': 'Model',
    'key': 'model',
    'href': '/model',
    'icon': faBrain,
    'permission': ['model:read'],
  },
  {
    'name': 'Action Log',
    'key': 'action-log',
    'href': '/action-log',
    'icon': faCalendarCheck,
    'permission': ['action-log:read'],
  },
  {
    'name': 'Setting',
    'key': 'setting',
    'href': '/setting',
    'icon': faGear,
    'permission': ['setting:read'],
  },
];

export const navigationRoute = navigation;
