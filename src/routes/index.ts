import userRoute from "../routes/userRoutes";

const routes = async (app: any) => {
	userRoute(app);
};
export default routes;
