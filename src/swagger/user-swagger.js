/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: OK - User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-08T12:52:46.984Z"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     email_verified:
 *                       type: boolean
 *                       example: false
 *                     identities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           connection:
 *                             type: string
 *                             example: "Username-Password-Authentication"
 *                           user_id:
 *                             type: string
 *                             example: "677e751ebecbc7810f7a8556"
 *                           provider:
 *                             type: string
 *                             example: "auth0"
 *                           isSocial:
 *                             type: boolean
 *                             example: false
 *                     name:
 *                       type: string
 *                       example: "user@example.com"
 *                     nickname:
 *                       type: string
 *                       example: "user"
 *                     picture:
 *                       type: string
 *                       example: "https://s.gravatar.com/avatar/316a26014c6e203f76d222f326462753?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fc.png"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-08T12:52:46.984Z"
 *                     user_id:
 *                       type: string
 *                       example: "auth0|677e751ebecbc7810f7a8556"
 *       400:
 *         description: Bad Request - Email and password are required
 *       409:
 *         description: Conflict - The user already exists
 *       500:
 *         description: Internal Server Error - Server error occurred
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                       description: The access token to be used in subsequent requests
 *                       example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkZmSDVfV3FtYWV1LXlWMnR0dTh3VyJ9.eyJpc3MiOiJodHRwczovL2Rldi1pcHMx..."
 *                     scope:
 *                       type: string
 *                       description: The scope of the access token
 *                       example: "read:files write:files read:users create:users"
 *                     expires_in:
 *                       type: integer
 *                       description: The expiration time in seconds (3600 = 1 hour)
 *                       example: 3600
 *                     token_type:
 *                       type: string
 *                       description: Type of the token
 *                       example: "Bearer"
 *       400:
 *         description: Bad Request - Invalid input data
 *       403:
 *         description: Forbiden - Wrong email or password
 *       500:
 *         description: Internal Server Error - Server error occurred
 */
