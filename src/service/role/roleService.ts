import Joi from "joi";
import RoleStore from "./roleStore";
import IROLE from "../../utils/interface/role/IRole";
import STATUS_CODES from "../../utils/enum/statusCodes";
import ErrorMessageEnum from "../../utils/enum/errorMessage";
import responseMessage from "../../utils/enum/responseMessage";
import * as IRoleService from "./IRoleService";
import { IAppServiceProxy } from "../appServiceProxy";
import { IApiResponse, toError } from "../../utils/interface/common";
import { apiResponse , apiFailureResponse } from "../../helper/apiResponses";
import { createSchema, getSchema , updateSchema} from "../../utils/common/joiSchema/role/roleSchema";
import { JoiError } from "../../helper/joiErrorHandler";

export default class RoleService implements IRoleService.IRoleServiceAPI {
    private roleStore = new RoleStore();
    private proxy: IAppServiceProxy;

    constructor(proxy: IAppServiceProxy) {
        this.proxy = proxy;
    }

    public create = async (req: IRoleService.ICreateRoleRequest,
        res: IRoleService.ICreateRoleResponse) => {
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
            response.statusCode = STATUS_CODES.UNPROCESSABLE_ENTITY
            response.message = ErrorMessageEnum.REQUEST_PARAMS_ERROR
            response.data = null
            response.status = false
            response.error = paramsError
            return apiFailureResponse(response)
        }
        const { name } = params.value;

        // Check if email is already registered
        let existingRole: IROLE;
        try {
            existingRole = await this.roleStore.getByName(name);
            //Error if email id is already exist
            if (existingRole && existingRole?.name) {
                response.statusCode = STATUS_CODES.BAD_REQUEST
                response.message = ErrorMessageEnum.ROLE_ALREADY_EXIST
                response.data = null
                response.status = false
                response.error = toError(ErrorMessageEnum.ROLE_ALREADY_EXIST)
                return apiFailureResponse(response)
            }
        } catch (e) {
            console.error(e);
            response.statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR
            response.message = ErrorMessageEnum.INTERNAL_ERROR
            response.data = null
            response.status = false
            response.error = toError(e.message)
            return apiFailureResponse(response)
        }
        let result: IROLE = await this.roleStore.createRole({ name });

        response.statusCode = STATUS_CODES.OK
        response.message = responseMessage.ROLE_CREATED
        response.data = result
        response.status = true
        response.error = {}
        return apiResponse(response)
    };

    public getRoleList = async (
        request: IRoleService.IGetAllRoleRequest,
        res: IRoleService.IGetAllRoleResponse,
    ) => {
        const response: IApiResponse = {
            response: res,
            statusCode: STATUS_CODES.UNKNOWN_CODE,
            message: responseMessage.INVALID_EMAIL_OR_CODE,
            data: null,
            status: false
        };
        try {
            const roles: IROLE[] = await this.roleStore.getAll();

            response.statusCode = STATUS_CODES.OK
            response.message = responseMessage.ROLES_FETCHED
            response.data = roles
            response.status = true
            response.error = null
            return apiResponse(response)

        } catch (e) {
            console.log(e)
            response.statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR
            response.message = ErrorMessageEnum.INTERNAL_ERROR
            response.data = null
            response.status = false
            response.error = toError(e.message)
            return apiFailureResponse(response)
        }
    }


    /**
     * Get user by Id
     */
    public getRoleById = async (
        request: IRoleService.IGetRoleRequest,
        res: IRoleService.IGetRoleResponse,
    ) => {
        const response: IApiResponse = {
            response: res,
            statusCode: STATUS_CODES.UNKNOWN_CODE,
            message: responseMessage.INVALID_EMAIL_OR_CODE,
            data: null,
            status: false
        };

        const { id } = request.params;
        const params = getSchema.validate(request.body);
        if (params.error) {
            console.error(params.error);
            let paramsError = JoiError(params.error)
            response.statusCode = STATUS_CODES.UNPROCESSABLE_ENTITY
            response.message = ErrorMessageEnum.REQUEST_PARAMS_ERROR
            response.data = null
            response.status = false
            response.error = paramsError
            return apiFailureResponse(response)
        }


        let role: IROLE;
        try {
            role = await this.roleStore.getById(id);

            //if user's id is incorrect
            if (!role) {
                response.statusCode = STATUS_CODES.BAD_REQUEST
                response.message = responseMessage.RECORD_NOT_FOUND
                response.data = null
                response.status = false
                response.error = toError(ErrorMessageEnum.INVALID_USER_ID)
                return apiFailureResponse(response)
            }
        } catch (e) {
            console.error(e);
            response.statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR
            response.message = ErrorMessageEnum.INTERNAL_ERROR
            response.data = null
            response.status = false
            response.error = toError(e.message)
            return apiFailureResponse(response)

        }
        response.statusCode = STATUS_CODES.OK;
        response.data = role;
        response.statusCode = STATUS_CODES.OK
        response.message = responseMessage.USERS_FETCHED
        response.data = role
        response.status = true
        response.error = null
        return apiResponse(response)
    };

    // loginUser
    public updateRole = async (request: IRoleService.IUpdateRoleRequest, res: IRoleService.IUpdateRoleResponse) => {
        const { id } = request.params;

        const response: IApiResponse = {
            response: res,
            statusCode: STATUS_CODES.UNKNOWN_CODE,
            message: responseMessage.INVALID_EMAIL_OR_CODE,
            data: null,
            status: false
        };

        const params = updateSchema.validate(request.body);
        if (params.error) {
            console.error(params.error);
            let paramsError = JoiError(params.error)
            response.statusCode = STATUS_CODES.UNPROCESSABLE_ENTITY
            response.message = ErrorMessageEnum.REQUEST_PARAMS_ERROR
            response.data = null
            response.status = false
            response.error = paramsError
            return apiFailureResponse(response)
        }

        let role: IROLE;
        try {
            role = await this.roleStore.getById(id);

            //if user's id is incorrect
            if (!role) {

                response.statusCode = STATUS_CODES.BAD_REQUEST
                response.message = responseMessage.RECORD_NOT_FOUND
                response.data = null
                response.status = false
                response.error = toError(ErrorMessageEnum.INVALID_USER_ID)
                return apiResponse(response)
            }
        } catch (e) {
            console.error(e);
            response.statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
            response.error = toError(e.message);
            response.message = ErrorMessageEnum.INTERNAL_ERROR
            response.data = null;
            response.status = false;

            return apiResponse(response)

        }
        let updateRole = await this.roleStore.updateById(id, request.body);

        response.statusCode = STATUS_CODES.OK;
        response.error = null
        response.message = responseMessage.ROLE_UPDATED
        response.data = role;
        response.status = true;

        return apiResponse(response)

    };

    // loginUser
    public deleteRole = async (request: IRoleService.IDeleteRoleRequest, res: IRoleService.IDeleteRoleResponse) => {
        const response: IApiResponse = {
            response: res,
            statusCode: STATUS_CODES.UNKNOWN_CODE,
            message: responseMessage.INVALID_EMAIL_OR_CODE,
            data: null,
            status: false
        };

        const params = getSchema.validate({id: request.params.id});
        if (params.error) {
            console.error(params.error);
            let paramsError = JoiError(params.error)
            response.statusCode = STATUS_CODES.UNPROCESSABLE_ENTITY
            response.message = ErrorMessageEnum.REQUEST_PARAMS_ERROR
            response.data = null
            response.status = false
            response.error = paramsError
            return apiFailureResponse(response)
        }
        let role: IROLE;
        try {
            role = await this.roleStore.getById(request.params.id);
            if (!role) {
                response.statusCode = STATUS_CODES.BAD_REQUEST;
                response.error = toError(ErrorMessageEnum.INVALID_USER_ID);
                response.message = responseMessage.RECORD_NOT_FOUND
                response.data = null
                response.status = false;
                return apiFailureResponse(response)
            }
            await this.roleStore.delete(request.params.id);
            response.statusCode = STATUS_CODES.OK
            response.error = {}
            response.message = responseMessage.ROLE_DELETED
            response.data = role
            response.status = true;
            return apiResponse(response)
        } catch (e) {
            console.error(e);
            response.statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
            response.error = toError(e.message);
            response.statusCode = STATUS_CODES.OK
            response.error = {}
            response.message = ErrorMessageEnum.INTERNAL_ERROR
            response.data = null
            response.status = false;
            return apiFailureResponse(response)
        }
    };

    public getRoleByName = async (request: IRoleService.IGetRoleByNameRequest, res: IRoleService.IGetRoleByNameResponse) => {

    }
}
