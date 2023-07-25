import * as IUserService from "./user/IUserService";
import UserService from "./user/userService";
import * as IRoleService from "./role/IRoleService";
import RoleService from "./role/roleService";
import * as IAuthService from "./auth/IAuthService";
import AuthService from "./auth/authService";
export interface IAppServiceProxy {
  auth: IAuthService.IAuthServiceAPI;
  user: IUserService.IUserServiceAPI;
  role: IRoleService.IRoleServiceAPI;
}

class AppServiceProxy implements IAppServiceProxy {
  public user: IUserService.IUserServiceAPI;
  public role: IRoleService.IRoleServiceAPI;
  public auth: IAuthService.IAuthServiceAPI;
  constructor() {
    this.user = new UserService(this);
    this.role = new RoleService(this);
    this.auth = new AuthService(this);
  }
}

export default new AppServiceProxy();
