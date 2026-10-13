import { ApiResponse } from "../../api/helpers/api-clients";
import { test, expect } from "../../fixtures/api-fixtures";
import { Login } from "../../api/models/login";
import { CONSTANTS } from "../../api/constants/constants";

test("Login with valid credentials", async ({ authorization }) => {
  const login: ApiResponse<Login> = await authorization.login(
  CONSTANTS.EMAIL,
  CONSTANTS.PASSWORD
  );
  expect(login.statusCode).toBe(200);
  expect(login.body?.success).toBe(true);
  expect(login.body?.token).toBeTruthy();
});
