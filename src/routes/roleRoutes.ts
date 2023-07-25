import proxy from "../service/appServiceProxy";
import { roleRoutes } from '../helper/routes';

const roleRoute = async (app: any) => {
    app.get(roleRoutes.RolesRoute ,proxy.auth.authenticate , proxy.role.getRoleList);
	app.get(roleRoutes.RoleByIdRoute ,proxy.auth.authenticate, proxy.role.getRoleById);
    app.post(roleRoutes.RolesRoute ,proxy.auth.authenticate, proxy.role.create);
    app.post(roleRoutes.RoleByIdRoute ,proxy.auth.authenticate, proxy.role.updateRole);
    app.post(roleRoutes.RolesByNameRoute ,proxy.auth.authenticate, proxy.role.getRoleByName);
    app.delete(roleRoutes.RoleByIdRoute ,proxy.auth.authenticate, proxy.role.deleteRole);
};

export default roleRoute;
