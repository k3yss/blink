type SessionId = string & { readonly brand: unique symbol }

type AuthenticationError = import("./errors").AuthenticationError

type IdentityUsername = string & { readonly brand: unique symbol }
type IdentityPassword = string & { readonly brand: unique symbol }

type UserId = string & { readonly brand: unique symbol }
type AuthToken = string & { readonly brand: unique symbol }
type SessionCookie = string & { readonly brand: unique symbol }

type TotpSecret = string & { readonly brand: unique symbol }
type TotpCode = string & { readonly brand: unique symbol }

type IdentityBase = {
  id: UserId
  createdAt: Date
  schema: SchemaId
  totpEnabled: boolean
}

type IdentityPhone = IdentityBase & {
  phone: PhoneNumber
  email: undefined
  emailVerified: undefined
}

type IdentityEmail = IdentityBase & {
  phone: undefined
  email: EmailAddress
  emailVerified: boolean
}

type IdentityPhoneEmail = IdentityBase & {
  phone: PhoneNumber
  email: EmailAddress
  emailVerified: boolean
}

type AnyIdentity = IdentityPhone | IdentityEmail | IdentityPhoneEmail

type Session = {
  identity: AnyIdentity
  id: SessionId
  expiresAt: Date
}

type WithSessionResponse = {
  authToken: AuthToken
  kratosUserId: UserId
}

type WithCookieResponse = {
  cookiesToSendBackToClient: Array<SessionCookie>
  kratosUserId: UserId
}

type LoginWithPhoneNoPasswordSchemaResponse = {
  authToken: AuthToken
  kratosUserId?: UserId
}
type LoginWithPhoneCookieSchemaResponse = {
  cookiesToSendBackToClient: Array<SessionCookie>
  kratosUserId?: UserId
}
type CreateKratosUserForPhoneNoPasswordSchemaResponse = WithSessionResponse
type CreateKratosUserForPhoneNoPasswordSchemaCookieResponse = WithCookieResponse

interface IAuthWithPhonePasswordlessService {
  loginToken(args: {
    phone: PhoneNumber
  }): Promise<LoginWithPhoneNoPasswordSchemaResponse | AuthenticationError>
  loginCookie(args: {
    phone: PhoneNumber
  }): Promise<LoginWithPhoneCookieSchemaResponse | AuthenticationError>
  logoutToken(args: { token: AuthToken }): Promise<void | AuthenticationError>
  logoutCookie(args: { cookie: SessionCookie }): Promise<void | AuthenticationError>
  createIdentityWithSession(args: {
    phone: PhoneNumber
    phoneMetadata?: PhoneMetadata
  }): Promise<CreateKratosUserForPhoneNoPasswordSchemaResponse | AuthenticationError>
  updateIdentityFromDeviceAccount(args: {
    phone: PhoneNumber
    userId: UserId
  }): Promise<IdentityPhone | AuthenticationError>
  createIdentityWithCookie(args: {
    phone: PhoneNumber
  }): Promise<
    CreateKratosUserForPhoneNoPasswordSchemaCookieResponse | AuthenticationError
  >
  createIdentityNoSession(args: {
    phone: PhoneNumber
  }): Promise<UserId | AuthenticationError>
  updatePhone(input: {
    kratosUserId: UserId
    phone: PhoneNumber
  }): Promise<IdentityPhone | AuthenticationError>
}

type ValidateCodeResult = {
  email: EmailAddress
  kratosUserId: UserId
  totpRequired: boolean
}

interface IAuthWithEmailPasswordlessService {
  removeEmailFromIdentity: (args: {
    kratosUserId: UserId
  }) => Promise<EmailAddress | AuthenticationError>
  removePhoneFromIdentity: (args: {
    kratosUserId: UserId
  }) => Promise<PhoneNumber | AuthenticationError>
  addPhoneToIdentity: (args: {
    userId: UserId
    phone: PhoneNumber
  }) => Promise<IdentityPhoneEmail | AuthenticationError>
  addUnverifiedEmailToIdentity(args: {
    kratosUserId: UserId
    email: EmailAddress
  }): Promise<IdentityPhoneEmail | AuthenticationError>
  sendEmailWithCode(args: { email: EmailAddress }): Promise<EmailFlowId | KratosError>
  hasEmail(args: { kratosUserId: UserId }): Promise<boolean | KratosError>
  isEmailVerified(args: { email: EmailAddress }): Promise<boolean | KratosError>
  validateCode(args: {
    code: EmailCode
    emailFlowId: EmailFlowId
  }): Promise<ValidateCodeResult | KratosError>
  loginToken(args: {
    email: EmailAddress
  }): Promise<LoginWithPhoneNoPasswordSchemaResponse | KratosError>
  loginCookie(args: {
    email: EmailAddress
  }): Promise<LoginWithPhoneCookieSchemaResponse | KratosError>
}

type CreateIdentityWithSessionResult = WithSessionResponse & {
  newEntity: boolean
}

interface IAuthWithUsernamePasswordDeviceIdService {
  createIdentityWithSession(args: {
    username: IdentityUsername
    password: IdentityPassword
  }): Promise<CreateIdentityWithSessionResult | AuthenticationError>
  upgradeToPhoneSchema(args: {
    phone: PhoneNumber
    userId: UserId
  }): Promise<true | KratosError>
}

interface IIdentityRepository {
  getIdentity(id: UserId): Promise<AnyIdentity | KratosError>
  deleteIdentity(id: UserId): Promise<void | KratosError>
  getUserIdFromIdentifier(identifier: string): Promise<UserId | KratosError>
}

// CCA2 country code such as "US" or "FR"
type CountryCode = string & { readonly brand: unique symbol }

type Country = {
  id: CountryCode
  supportedAuthChannels: ChannelType[]
}

type EmailRegistrationId = string & { readonly brand: unique symbol }
type TotpRegistrationId = string & { readonly brand: unique symbol }
type EmailLoginId = string & { readonly brand: unique symbol }

type EmailFlowId = EmailRegistrationId | EmailLoginId
