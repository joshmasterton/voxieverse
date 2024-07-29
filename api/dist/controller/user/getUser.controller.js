import { User } from '../../model/user.model.js';
export const getUserController = async (req, res) => {
    try {
        const auth_user_id = res.locals.user.user_id;
        const { user_id } = req.query;
        const user = new User(undefined, undefined, undefined, undefined, user_id);
        return res.status(200).json(await user.get(auth_user_id));
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        }
    }
};
