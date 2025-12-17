export const DELIVERY_PATTERNS = {
  REGISTER_DRIVER: { cmd: 'delivery.driver.register' },
  GET_DRIVER_PROFILE: { cmd: 'delivery.driver.profile.get' },
  UPDATE_DRIVER_PROFILE: { cmd: 'delivery.driver.profile.update' },
  UPDATE_DRIVER_STATUS: { cmd: 'delivery.driver.status.update' },
  UPDATE_DRIVER_LOCATION: { cmd: 'delivery.driver.location.update' },
  GET_AVAILABLE_DELIVERIES: { cmd: 'delivery.available.get' },
  ACCEPT_DELIVERY: { cmd: 'delivery.accept' },
  UPDATE_DELIVERY_STATUS: { cmd: 'delivery.status.update' },
  GET_DELIVERY_TRACKING: { cmd: 'delivery.tracking.get' },
} as const;
