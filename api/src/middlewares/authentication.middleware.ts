import * as express from "express";
import passport from "passport";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scope?: string[]
): Promise<any> {
  if (securityName === "api_key") {
    //TODO: Implement api keys
  }

  if (securityName === "jwt") {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false, failureMessage: true, successMessage: true },
        (err: any, user: { permissions: string | string[]; }) => {
          if (err) reject(err);
          if (user && !scope) resolve(user);
          if (
            user &&
            scope &&
            scope.length &&
            scope.every((s) => user.permissions.includes(s))
          )
            resolve(user);
          else reject(new Error("Unauthorized"));
        }
      )(request);
    });
  }
}
