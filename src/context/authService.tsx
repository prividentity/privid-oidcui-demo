import { UserManager, WebStorageStateStore } from 'oidc-client';

const config = {
  authority: process.env.REACT_APP_OIDC_AUTHORITY || "", // Replace with your OIDC Authority
  client_id: process.env.REACT_APP_CLIENT_ID || "", // Replace with your client ID
  client_secret: process.env.REACT_APP_CLIENT_SECRET || "",
  redirect_uri: process.env.REACT_APP_OIDC_REDIRECT_URL || "", // Handle the callback after login
  response_type: "code",
  scope: "openid privateid", // or other scopes
  post_logout_redirect_uri: window.location.origin,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

class AuthService {
  userManager = new UserManager(config);
  login = (extraParams: any) => {
    return this.userManager.signinRedirect({
        extraQueryParams: extraParams
      });
  };

  completeLogin = async () => {
    await this.userManager.signinRedirectCallback();
    
  };

  logout = () => {
    return this.userManager.signoutRedirect();
  };

  getUser = async () => {
    return await this.userManager.getUser();
  };
}

export default new AuthService();
