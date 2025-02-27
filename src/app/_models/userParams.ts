import { User } from "./user.model";

export class UserParams {
    pageNumber = 1;
    pageSize = 5;
    orderBy = 'lastActive';

    constructor(user: User | null) {
    }
}
