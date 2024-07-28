import { User } from '../../model/user.model.js';
export const getUserController = async (req, res) => {
    try {
        const { user_id } = req.query;
        const user = new User(undefined, undefined, undefined, undefined, user_id);
        return res.status(200).json(await user.get());
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        }
    }
};
