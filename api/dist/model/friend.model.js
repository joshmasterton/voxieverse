import { Db, tableConfigManager } from '../database/db.database.js';
import { User } from './user.model.js';
const db = new Db();
export class Friend {
    friend_initiator_id;
    friend_one_id;
    friend_two_id;
    constructor(friend_initiator_id, friend_one_id, friend_two_id) {
        this.friend_initiator_id = friend_initiator_id;
        this.friend_one_id = friend_one_id;
        this.friend_two_id = friend_two_id;
    }
    async create() {
        const { friendsTable, usersTable } = tableConfigManager.getConfig();
        try {
            const friendOne = await new User(undefined, undefined, undefined, undefined, this.friend_one_id).get();
            const friendTwo = await new User(undefined, undefined, undefined, undefined, this.friend_two_id).get();
            if (!friendOne || !friendTwo) {
                throw new Error('User not found');
            }
            const existingFriend = await db.query(`
					SELECT * FROM ${friendsTable}
					WHERE (friend_one_id = $1 AND friend_two_id = $2)
					OR (friend_two_id = $1 AND friend_one_id = $2)
				`, [this.friend_one_id, this.friend_two_id]);
            if (existingFriend?.rows[0]) {
                if (this.friend_one_id === existingFriend?.rows[0].friend_initiator_id) {
                    return this.serializeFriend(existingFriend);
                }
                else {
                    const updatedFriendship = await db.query(`
							UPDATE ${friendsTable}
							SET friend_accepted = $1
							WHERE (friend_one_id = $2 AND friend_two_id = $3)
							OR (friend_two_id = $2 AND friend_one_id = $3)
							RETURNING *
						`, [true, this.friend_one_id, this.friend_two_id]);
                    await db.query(`
							UPDATE ${usersTable}
							SET friends = friends + 1
							WHERE user_id = $1
						`, [this.friend_one_id]);
                    await db.query(`
							UPDATE ${usersTable}
							SET friends = friends + 1
							WHERE user_id = $1
						`, [this.friend_two_id]);
                    return this.serializeFriend(updatedFriendship);
                }
            }
            const newFriend = await db.query(`
					INSERT INTO ${friendsTable}(friend_initiator_id, friend_one_id, friend_two_id)
					VALUES($1, $2, $3) RETURNING *
				`, [this.friend_initiator_id, this.friend_one_id, this.friend_two_id]);
            return this.serializeFriend(newFriend);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    }
    async remove() {
        const { friendsTable, usersTable } = tableConfigManager.getConfig();
        try {
            const existingFriend = await db.query(`
					SELECT * FROM ${friendsTable}
					WHERE (friend_one_id = $1 AND friend_two_id = $2)
					OR (friend_two_id = $1 AND friend_one_id = $2)
				`, [this.friend_one_id, this.friend_two_id]);
            if (existingFriend?.rows[0]) {
                await db.query(`
						DELETE FROM ${friendsTable}
						WHERE (friend_one_id = $1 AND friend_two_id = $2)
						OR (friend_two_id = $1 AND friend_one_id = $2)
					`, [this.friend_one_id, this.friend_two_id]);
                if (existingFriend.rows[0].friend_accepted) {
                    await db.query(`
							UPDATE ${usersTable}
							SET friends = friends - 1
							WHERE user_id = $1
						`, [this.friend_one_id]);
                    await db.query(`
							UPDATE ${usersTable}
							SET friends = friends - 1
							WHERE user_id = $1
						`, [this.friend_two_id]);
                }
                return 'Friend removed';
            }
            else {
                throw new Error('No friend to remove here');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    }
    async get() {
        const { friendsTable } = tableConfigManager.getConfig();
        try {
            const friend = await db.query(`
					SELECT * FROM ${friendsTable}
					WHERE (friend_one_id = $1 AND friend_two_id = $2)
					OR (friend_two_id = $1 AND friend_one_id = $2)
				`, [this.friend_one_id, this.friend_two_id]);
            if (!friend?.rows[0]) {
                return undefined;
            }
            return this.serializeFriend(friend);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
        }
    }
    serializeFriend(friend) {
        return {
            id: friend.rows[0].id,
            friend_initiator_id: friend.rows[0].friend_initiator_id,
            friend_one_id: friend.rows[0].friend_one_id,
            friend_two_id: friend.rows[0].friend_two_id,
            friend_accepted: friend.rows[0].friend_accepted,
            created_at: new Date(friend.rows[0].created_at).toLocaleString()
        };
    }
}
