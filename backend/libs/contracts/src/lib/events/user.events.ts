export class UserRegisteredEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly role: string,
  ) {}
}

export class UserLoggedInEvent {
  constructor(
    public readonly userId: string,
    public readonly timestamp: Date,
  ) {}
}

export class UserProfileUpdatedEvent {
  constructor(
    public readonly userId: string,
    public readonly changes: Record<string, any>,
  ) {}
}

export class PasswordChangedEvent {
  constructor(
    public readonly userId: string,
    public readonly timestamp: Date,
  ) {}
}

export class AddressCreatedEvent {
  constructor(
    public readonly userId: string,
    public readonly addressId: string,
    public readonly isDefault: boolean,
  ) {}
}
