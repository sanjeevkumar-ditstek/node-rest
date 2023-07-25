import IUSER from "../../utils/interface/user/IUser";
import { UserModel } from "../../db/model/users";

export default class UserStore {
	public static OPERATION_UNSUCCESSFUL = class extends Error {
		constructor() {
			super("An error occured while processing the request.");
		}
	};

	/**
	 * creating new user and saving in Database
	 */
	public async createUser(userInput: IUSER): Promise<IUSER> {
		try {
			let savedUser:any = await UserModel.create(userInput);
			return savedUser;
		} catch (error) {
			return error;
		}
	}

	/**
	 *Get by email
	 */
	public async getByEmail(email: string): Promise<IUSER> {
		try {
			let user: any = (await UserModel.findOne({ email }));
			return user;
		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}

	/**
	 *Get by id
	 */
	public async getById(id: string): Promise<IUSER> {
		try {
			let user: any = await UserModel.findOne({_id : id});
			return user;
		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}

	public async getAll(): Promise<IUSER[]> {
		try {
			let users: any = await UserModel.find();
			return users
		} catch (e) {
			return Promise.reject(new UserStore.OPERATION_UNSUCCESSFUL());
		}
	}
}
