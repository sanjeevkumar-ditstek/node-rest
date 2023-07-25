import Joi from "joi";
import UserStore from "./userStore";
import IUSER from "../../utils/interface/user/IUser";
import STATUS_CODES from "../../utils/enum/statusCodes";
import ErrorMessageEnum from "../../utils/enum/errorMessage";
import responseMessage from "../../utils/enum/responseMessage";
import * as IUserService from "./IUserService";
import { IAppServiceProxy } from "../appServiceProxy";
import { IApiResponse, toError } from "../../utils/interface/common";
import { apiResponse , apiFailureResponse} from "../../helper/apiResponses";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JoiError } from "../../helper/joiErrorHandler";
import { createSchema, getSchema, loginSchema } from "../../utils/common/joiSchema/user/userSchema";

export default class UserService implements IUserService.IUserServiceAPI {
    private userStore = new UserStore();
    private proxy: IAppServiceProxy;
    constructor(proxy: IAppServiceProxy) {
        this.proxy = proxy;
    }
    private generateJWT = (user: IUSER): string => {
        const payLoad = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        return jwt.sign(payLoad, process.env.JWT_SECRET);
    };

    public create = async (req: IUserService.IRegisterUserRequest,
        res: IUserService.IRegisterUserResponse,) => {
        const response: IApiResponse = {
            response: res,
            statusCode: STATUS_CODES.UNKNOWN_CODE,
            message: responseMessage.INVALID_EMAIL_OR_CODE,
            data: null,
            status: false
        };
        
        const params = createSchema.validate(req.body);
        if (params.error) {
            console.error(params.error);
            let paramsError = JoiError(params.error)
            response.statusCode = STATUS_CODES.UNPROCESSABLE_ENTITY;
            response.message = ErrorMessageEnum.REQUEST_PARAMS_ERROR
            response.data = null
            response.status = false
            response.error = paramsError
            return apiFailureResponse(response);
        }
        const { firstname, lastname, email, password, role } = params.value;

        // Check if email is already registered
        let existingUser: IUSER;
        try {
            existingUser = await this.userStore.getByEmail(email);
            //Error if email id is already exist
            if (existingUser && existingUser?.email) {

                response.statusCode = STATUS_CODES.BAD_REQUEST
                response.message = ErrorMessageEnum.EMAIL_ALREADY_EXIST
                response.data = null
                response.status = false
                response.error = toError(ErrorMessageEnum.EMAIL_ALREADY_EXIST)
                return apiFailureResponse(response);
            }
        } catch (e) {
            console.error(e);

            response.statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR
            response.message = ErrorMessageEnum.INTERNAL_ERROR
            response.data = null
            response.status = false
            response.error = toError(e.message)
            return apiFailureResponse(response);

        }

        // let rolePayload: IRoleService.IgetRoleByNamePayload = { role };
        // let roleResponse: IRoleService.IgetRoleByNameResponse = await this.proxy.role.getByName(rolePayload);

        // if (roleResponse.statusCode !== STATUS_CODES.OK) {
        // 	return roleResponse;
        // }
        let user: IUSER;
        try {
            const hashPassword = await bcrypt.hash(password, 10);
            const attributes: IUSER = {
                firstname,
                lastname,
                email: email.toLowerCase(),
                password: hashPassword,
                // role: roleResponse.data._id
                role
            };
            user = await this.userStore.createUser(attributes);

            response.statusCode = STATUS_CODES.OK
            response.message = responseMessage.USER_CREATED
            response.data = user
            response.status = true
            response.error = null
            return apiResponse(response);

        } catch (e) {
            console.error(e);
            response.statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR
            response.message = ErrorMessageEnum.INTERNAL_ERROR
            response.data = null
            response.status = false
            response.error = toError(e.message)
            return apiFailureResponse(response);

        }
    };

    // public create = async (
    // request: IUserService.IRegisterUserRequest,
    // res: IUserService.IRegisterUserResponse,
    // ) => {
    //     const response: IUserService.IRegisterUserResponse = {
    //         status: STATUS_CODES.UNKNOWN_CODE,
    //     };
    //     const schema = Joi.object().keys({
    //         firstname: Joi.string().required(),
    //         lastname: Joi.string().required(),
    //         email: Joi.string().email().required(),
    //         password: Joi.string().required(),
    //     });
    //     const params = schema.validate(request.body);
    //     if (params.error) {
    //         console.error(params.error);
    //         return apiResponse(res, STATUS_CODES.UNPROCESSABLE_ENTITY, ErrorMessageEnum.REQUEST_PARAMS_ERROR, response, true, null);
    //     }
    //     const { firstname, lastname, email, password } = params.value;

    //     // Check if email is already registered
    //     let existingUser: IUSER;
    //     try {
    //         existingUser = await this.userStore.getByEmail(email);
    //         //Error if email id is already exist
    //         if (existingUser && existingUser?.email) {
    //             return apiResponse(res, STATUS_CODES.BAD_REQUEST, ErrorMessageEnum.EMAIL_ALREADY_EXIST, response, false, toError(ErrorMessageEnum.EMAIL_ALREADY_EXIST));
    //         }

    //     } catch (e) {
    //         console.error(e);
    //         return apiResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, response, false, toError(e.message));
    //     }

    //     let user: IUSER;
    //     const attributes: IUSER = {
    //         firstname,
    //         lastname,
    //         email: email.toLowerCase(),
    //         password
    //     };

    //     try {
    //         user = await this.userStore.createUser(attributes);
    //     } catch (e) {
    //         console.error(e);
    //         return apiResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, ErrorMessageEnum.INTERNAL_ERROR, response, false, toError(e.message));
    //     }
    //     return apiResponse(res, STATUS_CODES.OK, responseMessage.USER_CREATED, response, true, null)
    // };

    public getUsers = async (
        request: IUserService.IGetAllUserRequest,
        res: IUserService.IGetAllUserResponse,
    ) => {
        const response: IApiResponse = {
            response: res,
            statusCode: STATUS_CODES.UNKNOWN_CODE,
            message: responseMessage.INVALID_EMAIL_OR_CODE,
            data: null,
            status: false
        };
        try {
            const users: IUSER[] = await this.userStore.getAll();

            const response: IApiResponse = {
                response: res,
                statusCode: STATUS_CODES.OK,
                message: responseMessage.USERS_FETCHED,
                data: users,
                status: true,
                error: null
            };


            return apiResponse(response)

        } catch (e) {
            console.log(e)


            const response: IApiResponse = {
                response: res,
                statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
                message: ErrorMessageEnum.INTERNAL_ERROR,
                data: null,
                status: false,
                error: toError(e.message)
            };


            return apiFailureResponse(response)
        }
    }

    /**
     * User login
     */
    // public login = async (
    // 	request: IUserService.ILoginUserRequest,
    // 	res: IUserService.ILoginUserResponse,
    // ) => {
    // 	const response: IUserService.ILoginUserResponse = {
    // 		status: STATUS_CODES.UNKNOWN_CODE,
    // 	};
    // 	const schema = Joi.object().keys({
    // 		email: Joi.string().email().required(),
    // 		password: Joi.string().required(),
    // 	});
    // 	const params = schema.validate(request.body);

    // 	if (params.error) {
    // 		console.error(params.error);
    // 		response.status = STATUS_CODES.UNPROCESSABLE_ENTITY;
    // 		response.error = toError(params.error.details[0].message);
    // 		return apiResponse(res, response);
    // 	}
    // 	const { email, password } = params.value;
    // 	let user: IUSER;
    // 	try {
    // 		//get user bu email id to check it exist or not
    // 		user = await this.userStore.getByEmail(email);
    // 		//if credentials are incorrect
    // 		if (!user) {
    // 			response.status = STATUS_CODES.UNAUTHORIZED;
    // 			response.error = toError(ErrorMessageEnum.INVALID_CREDENTIALS);
    // 			return apiResponse(res, response);
    // 		}
    // 	} catch (e) {
    // 		console.error(e);
    // 		response.status = STATUS_CODES.INTERNAL_SERVER_ERROR;
    // 		response.error = toError(e.message);
    // 		return apiResponse(res, response);
    // 	}

    // 	//comparing password to insure that password is correct
    // 	const isValid = await bcrypt.compare(password, user?.password);

    // 	//if isValid or user.password is null
    // 	if (!isValid || !user?.password) {
    // 		response.status = STATUS_CODES.UNAUTHORIZED;
    // 		response.error = toError(ErrorMessageEnum.INVALID_CREDENTIALS);
    // 		return apiResponse(res, response);
    // 	}
    // 	response.status = STATUS_CODES.OK;
    // 	response.token = this.generateJWT(user);
    // 	response.user = user;
    // 	return apiResponse(res, response);
    // };

    /**
     * Get user by Id
     */
    public getUserById = async (
        request: IUserService.IGetUserRequest,
        res: IUserService.IGetUserResponse,
    ) => {
        const response: IApiResponse = {
            response: res,
            statusCode: STATUS_CODES.UNKNOWN_CODE,
            message: responseMessage.INVALID_EMAIL_OR_CODE,
            data: null,
            status: false
        };

        const params = getSchema.validate(request.params);

        if (params.error) {
            console.error(params.error);


            response.response = res
            response.statusCode = STATUS_CODES.UNPROCESSABLE_ENTITY
            response.message = ErrorMessageEnum.REQUEST_PARAMS_ERROR
            response.data = null
            response.status = false
            response.error = toError(params.error.details[0].message)


            return apiFailureResponse(response)
        }

        const { id } = params.value;
        let user: IUSER;
        try {
            user = await this.userStore.getById(id);

            //if user's id is incorrect
            if (!user) {
                response.statusCode = STATUS_CODES.BAD_REQUEST;
                response.message = ErrorMessageEnum.REQUEST_PARAMS_ERROR
                response.data = null
                response.status = false
                response.error = toError(ErrorMessageEnum.INVALID_USER_ID);


                return apiFailureResponse(response)
            }
        } catch (e) {
            console.error(e);
            response.statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
            response.message = ErrorMessageEnum.INTERNAL_ERROR
            response.data = null
            response.status = false
            response.error = toError(e.message)
            return apiFailureResponse(response)


        }
        response.statusCode = STATUS_CODES.OK;
        response.message = responseMessage.USER_FETCHED
        response.data = user
        response.status = true
        response.error = null
        return apiResponse(response)
    };

    // loginUser
    public loginUser = async (req: IUserService.ILoginUserRequest, res: IUserService.ILoginUserResponse) => {
        const { email, password } = req.body;
        const response: IApiResponse = {
            response: res,
            statusCode: STATUS_CODES.UNKNOWN_CODE,
            message: responseMessage.INVALID_EMAIL_OR_CODE,
            data: null,
            status: false
        };
        let user: IUSER;
        const params = loginSchema.validate(req.body);
        if (params.error) {
            console.error(params.error);
            let paramsError = JoiError(params.error)
            response.statusCode = STATUS_CODES.UNPROCESSABLE_ENTITY;
            response.message = ErrorMessageEnum.REQUEST_PARAMS_ERROR
            response.data = null
            response.status = false
            response.error = paramsError
            return apiFailureResponse(response);
        }
        try {
            user = await this.userStore.getByEmail(email);
            if (!user) {
                response.statusCode = STATUS_CODES.BAD_REQUEST
                response.message = ErrorMessageEnum.USER_NOT_EXIST
                response.data = null
                response.status = false
                response.error = toError(ErrorMessageEnum.USER_NOT_EXIST)
                return apiFailureResponse(response)
            }
            const isValid = await bcrypt.compare(password, user?.password);

            //if isValid or user.password is null
            if (!isValid || !user?.password) {
                const errorMsg = responseMessage.INVALID_CREDENTIALS;
                response.statusCode = STATUS_CODES.UNAUTHORIZED;
                response.error = toError(errorMsg);
                return response;
            }
            let token: string = this.generateJWT(user);
            response.statusCode = STATUS_CODES.OK;
            response.message = responseMessage.USER_FETCHED
            response.data = { user, token }
            response.status = true
            response.error = null
            return apiResponse(response)

        } catch (e) {
            response.statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
            response.message = ErrorMessageEnum.INTERNAL_ERROR
            response.data = null
            response.status = false
            response.error = toError(e.message)
            return apiFailureResponse(response)

        }
    };
}
