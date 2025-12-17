export const USER_PATTERNS = {
  GET_PROFILE: { cmd: 'user.profile.get' },
  UPDATE_PROFILE: { cmd: 'user.profile.update' },
  GET_ADDRESSES: { cmd: 'user.addresses.get' },
  CREATE_ADDRESS: { cmd: 'user.address.create' },
  UPDATE_ADDRESS: { cmd: 'user.address.update' },
  DELETE_ADDRESS: { cmd: 'user.address.delete' },
  REGISTER_DEVICE: { cmd: 'user.device.register' },
  GET_FAVORITES: { cmd: 'user.favorites.get' },
  ADD_FAVORITE: { cmd: 'user.favorite.add' },
  REMOVE_FAVORITE: { cmd: 'user.favorite.remove' },
} as const;
