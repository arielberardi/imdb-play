export class AuthRequiredError extends Error {
  public constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthRequiredError";
  }
}
