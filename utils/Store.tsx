import Cookies from 'js-cookie';
import React, { createContext, useReducer } from 'react';
import { StateType, Action } from '../utils/types';

const initialState = {
  cartItems: Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems') as string) : [],
  carSize: Cookies.get('carSize') ? (Cookies.get('carSize') as string) : 'small',
  shippingAddress: Cookies.get('shippingAddress')
    ? {
        ...JSON.parse(Cookies.get('shippingAddress') as string),
        pickupDate: undefined,
        dropoffDate: undefined,
      }
    : {},
};

const saveCarSize = (carCategory: string) => {
  const small = ['Hatchback', 'Convertible', 'Coupe', 'Sedan', 'Wagon'];
  const medium = ['SUV'];
  const large = ['XL', 'Pickup', 'Van/Minivan'];

  if (small.includes(carCategory)) return 'small';
  if (medium.includes(carCategory)) return 'medium';
  if (large.includes(carCategory)) return 'large';

  return 'small';
};

export const Store = createContext<{
  state: StateType;
  dispatch: React.Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null,
});

function reducer(state: StateType, action: Action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const newCartItems = [...state.cartItems, newItem];
      Cookies.set('cartItems', JSON.stringify(newCartItems));
      return {
        cartItems: newCartItems,
        shippingAddress: state.shippingAddress,
        carSize: state.carSize,
      };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cartItems.filter(
        (item) => Number(item.id) !== Number(action.payload),
      );
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return {
        cartItems: cartItems,
        shippingAddress: state.shippingAddress,
        carSize: state.carSize,
      };
    }
    case 'SAVE_SHIPPING_ADDRESS':
      const data = action.payload;
      Cookies.set('shippingAddress', JSON.stringify({ ...data }));
      if (data.carModel) {
        const categoryArr = data.carModel.Category.split(',');
        const size = saveCarSize(categoryArr[0]);
        Cookies.set('carSize', size);
        return {
          cartItems: [...state.cartItems],
          carSize: size,
          shippingAddress: {
            ...data,
          },
        };
      } else {
        return {
          cartItems: [...state.cartItems],
          shippingAddress: {
            ...data,
          },
        };
      }

    case 'CART_CLEAR':
      Cookies.remove('cartItems');
      return {
        shippingAddress: state.shippingAddress,
        cartItems: [],
        carSize: 'small',
      };
    default:
      return state;
  }
}

export const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>;
};
