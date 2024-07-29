import { User } from '../../model/user.model.js';
export const getUsersController = async (req, res) => {
    try {
        const { user_id } = res.locals.user;
        const { page, sort, search, friends } = req.query;
        const users = await new User(undefined, undefined, undefined, undefined, user_id).gets(page, sort, user_id, search, friends);
        return res.status(200).json(users);
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        }
    }
};
