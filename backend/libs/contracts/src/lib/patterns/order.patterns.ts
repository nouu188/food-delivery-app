export const ORDER_PATTERNS = {
  GET_CART: { cmd: 'order.cart.get' },
  ADD_TO_CART: { cmd: 'order.cart.item.add' },
  UPDATE_CART_ITEM: { cmd: 'order.cart.item.update' },
  REMOVE_FROM_CART: { cmd: 'order.cart.item.remove' },
  CLEAR_CART: { cmd: 'order.cart.clear' },
  CREATE_ORDER: { cmd: 'order.create' },
  GET_ORDERS: { cmd: 'order.list.get' },
  GET_ORDER: { cmd: 'order.one.get' },
  CANCEL_ORDER: { cmd: 'order.cancel' },
  REORDER: { cmd: 'order.reorder' },
  GET_RESTAURANT_ORDERS: { cmd: 'order.restaurant.get' },
  UPDATE_ORDER_STATUS: { cmd: 'order.status.update' },
} as const;
