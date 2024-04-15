import { config } from "../config/config";
import express from "express";
import { updateName, getUserFullNameByID, searchUsersWithName } from "../models/users";
import jwt from "jsonwebtoken";
const router = require("express").Router();

router.get("/", (req: express.Request, res: express.Response) => {
	res.send(":D");
});

router.post(
	"/update-name",
	async (req: express.Request, res: express.Response) => {
		const { user_id, firstName, lastName, accessToken } = req.body;

		let parsed_user_id;
		if (!accessToken) {
			return res.status(401).json({ error: "Failed to parse access token" });
		}
		try {
			const decodedToken = jwt.verify(accessToken, config.accessTokenSecret);

			if (typeof decodedToken === "object" && "user_id" in decodedToken) {
				parsed_user_id = decodedToken.user_id;
			} else {
				return res.status(401).json({ error: "User token does not have user" });
			}

			if (parsed_user_id !== user_id) {
				return res.status(401).json({ error: "User does not match profile" });
			}

			const updatedUserNames = await updateName(user_id, firstName, lastName);

			if (!updatedUserNames) {
				return res.status(501).json("Error updating names");
			}
			res.status(200).json(updatedUserNames);
		} catch (error) {
			return res.status(500).json(`Error: ${(error as Error).message}`);
		}
	}
);

router.get(
	"/get-profile/:user_id",
	async (req: express.Request, res: express.Response) => {
		try {
			const { user_id } = req.params;
			if (!user_id) {
				return res.status(405).json("No user ID");
			}
			const user = await getUserFullNameByID(user_id);

			if (!user) {
				return res.status(500).json("Error getting names");
			}

			res.json(user);
		} catch (error) {
			return res.status(500).json(`Error: ${(error as Error).message}`);
		}
	}
);

router.get(
	"/search-profile/:name",
	async (req: express.Request, res: express.Response) => {
		try {
			const {name} = req.params;
			if(!name){
				return res.status(405).json("Empty search query")
			}
			const users = await searchUsersWithName(name);
			{/*Goal is to return name + profile image*/}
			if (!users) {
				return res.status(404).json("No users found");
			}

			res.json(users);
		} catch (error) {
			return res.status(500).json(`Error Router: ${(error as Error).message}`);
		}
	}
);
module.exports = router;