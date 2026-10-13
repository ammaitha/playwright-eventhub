import { Methods } from "../constants/methods";
import { CONSTANTS } from "../constants/constants";
import { ApiClient, ApiRequest } from "../helpers/api-clients";
import { Login } from "../models/login";

export class Authorization {
  constructor() {}

  public async login(email: string, password: string) {
    const apiClient: ApiClient = await ApiClient.create(CONSTANTS.API_BASE_URL);
    const loginRequest: ApiRequest = {
      url: "auth/login",
      method: Methods.POST,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },

      body: {
        email: email,
        password: password,
      },
    };
    return apiClient.send<Login>(loginRequest);
  }
}
