import proxy from "../service/appServiceProxy";
import { roleRoutes } from '../helper/routes';

const roleRoute = async (app: any) => { //,proxy.auth.authenticate
    app.get(roleRoutes.RolesRoute, proxy.role.getRoleList);
    app.get(roleRoutes.RoleByIdRoute, proxy.role.getRoleById);
    app.post(roleRoutes.RolesRoute, proxy.role.create);
    app.post(roleRoutes.RoleByIdRoute, proxy.role.updateRole);
    app.post(roleRoutes.RolesByNameRoute, proxy.role.getRoleByName);
    app.delete(roleRoutes.RoleByIdRoute, proxy.role.deleteRole);
};

export default roleRoute;
