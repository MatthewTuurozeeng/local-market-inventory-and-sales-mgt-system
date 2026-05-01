export interface AuthPayload { // the AuthPayload interface defines the structure of the authentication payload returned upon successful login. It includes the vendor's unique identifier, email, and business name, which can be used for session management and personalization in the application.
  id: string;
  email: string;
  businessName: string;
}
