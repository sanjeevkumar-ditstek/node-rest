import userRoute from "../routes/userRoutes";
import roleRoute from "./roleRoutes";

const routes = async (app: any) => {
	userRoute(app);
	roleRoute(app);
};
export default routes;
