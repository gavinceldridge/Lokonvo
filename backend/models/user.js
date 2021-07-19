"use strict";
const bcrypt = require("bcrypt")
const db = require("../db")
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError")
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { sqlForPartialUpdate } = require("../../../Springboard/Unit43/react-jobly/backend/helpers/sql");

class User {

    /**
     * authenticate: username, password
     * 
     * RETURN ({username, email, is_admin})
     * 
     * Throws UnauthorizedError if user/password combo is incorrect or not found
     */
    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT username,
                password,
                email,
                is_admin AS "isAdmin"
            FROM users
            WHERE username = $1`,
            [username]
        )

        const user = result.rows[0]

        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
            throw new UnauthorizedError("Invalid password")
        }
        throw new UnauthorizedError("User does not exist")
    }

    /**
     * @param {username, password, email, isAdmin}
     * @returns {username, email, isAdmin}
     */
    static async register({ username, password, email, isAdmin }) {

        const dupeUsernameCheck = await db.query(`
            SELECT username
            FROM users
            WHERE username = $1`,
            [username]
        )

        const dupeEmailCheck = await db.query(`
            SELECT email
            FROM users
            WHERE email = $1`,
            [email]
        )

        if (dupeUsernameCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`)
        } else if (dupeEmailCheck.rows[0]) {
            throw new BadRequestError(`Duplicate email: ${email}`)
        }

        const bPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR)

        const res = await db.query(`
            INSERT INTO users
                (username, password, email, is_admin)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING username, email, is_admin AS "isAdmin"
            `, [username, bPassword, email, isAdmin]
        )

        return res.rows[0];
    }

    /**
     * Find all users
     * 
     * Returns [{username, email, is_admin}, ...]
     */
    static async findAll() {
        return await db.query(`
        SELECT username, email, is_admin AS "isAdmin"
        FROM users
        ORDER BY username`
        ).rows
    }

    /**
     * Get user by username
     * 
     * Returns Returns {username, email, is_admin}
     * 
     * If user does not exist, throws NotFoundError
     */
    static async find(username) {
        const userRes = await db.query(`
            SELECT username, email, is_admin AS "isAdmin",
            FROM users
            WHERE username = $1
        `, [username])
    }

    /**
     * Update fields of the user if there is a user with the given username
     * 
     * If no user found, throw NotFoundError
     * 
     * Data can include the following fields: [password, isAdmin, email, location, radius]
     * 
     * Returns { username, email, isAdmin, location, radius }
     * 
    */
    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR)
        }

        const { fields, values } = sqlForPartialUpdate(data, { isAdmin: "is_admin" })
        const usernameFieldIdx = `$${values.length + 1}`

        const query = `
            UPDATE users
            SET ${fields}
            WHERE username=${usernameFieldIdx}
            RETURNING username, email, is_admin AS "isAdmin"`

        const user = await db.query(query, [...values, username]).rows[0]
        if (!user) throw new NotFoundError(`No user: ${username}`)

        delete user.password
        return user
    }

    static async delete(username) {
        const user = await db.query(`
            DELETE
            FROM users
            WHERE username=$1
            RETURNING username
        `, [username]).rows[0]

        if (!user) throw new NotFoundError(`No user: ${username}`)
    }

}

module.exports = User
