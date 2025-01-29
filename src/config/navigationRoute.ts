import {
  faHome,
  faUser,
  faGear,
  faBox,
  faUserTie,
  faShop,
  faUsersRectangle,
} from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface NavigationItem {
  name: string;
  key: string;
  href: string;
  icon: IconDefinition;
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
  },
  {
    'name': 'Customer',
    'key': 'customer',
    'href': '/customer',
    'icon': faUser,
  },
  {
    'name': 'Products',
    'key': 'product',
    'href': '/product',
    'icon': faBox,
  },
  {
    'name': 'User',
    'key': 'user',
    'href': '/user',
    'icon': faUserTie,
  },
  {
    'name': 'Tier',
    'key': 'tier',
    'href': '/tier',
    'icon': faUsersRectangle,
  },
  {
    'name': 'Setting',
    'key': 'setting',
    'href': '/setting',
    'icon': faGear,
  },
];

export const navigationRoute = navigation;
