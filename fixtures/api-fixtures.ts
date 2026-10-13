
import {test as base} from "@playwright/test"
import { Authorization } from "../api/endpoints/authorization";
import { Events } from "../api/endpoints/events";
import { Bookings } from "../api/endpoints/bookings";
import { ApiResponse } from "../api/helpers/api-clients";
import { Login } from "../api/models/login";
import { CONSTANTS } from "../api/constants/constants";


type MyFixtures = {
    authorization: Authorization,
    authToken: string,
    events: Events,
    bookings: Bookings,
};

export const test = base.extend<MyFixtures>({
    authorization: async ({}, use) => {
        await use(new Authorization());
    },
    authToken: async ({ authorization }, use) => {
        const login: ApiResponse<Login> = await authorization.login(
            CONSTANTS.EMAIL,
            CONSTANTS.PASSWORD,
        );
        if (login.statusCode !== 200 || !login.body?.success || !login.body.token) {
            throw new Error(`API authentication failed with status ${login.statusCode}`);
        }
        await use(login.body.token);
    },
    events: async ({ authToken }, use) => {
        await use(new Events(authToken));
    },
    bookings: async ({ authToken }, use) => {
        await use(new Bookings(authToken));
    },
})

export {expect} from "@playwright/test"