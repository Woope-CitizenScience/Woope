import { config } from "../config/config";
import express from "express";
import { updateName, getUserFullNameByID, searchUsersWithName } from "../models/users";
import jwt from "jsonwebtoken";
import { checkFollowExists, createFollowRelation, deleteFollowRelation, getFollowerCount, getFollowersList, getFollowingCount, getFollowingList } from "../models/user-follows";
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
			if (error instanceof jwt.JsonWebTokenError) {
				res.status(403).json('Invalid access token');
			} else {
				res.status(500).json(`Internal server error: ${(error as Error).message}`);
			}
		}
	}
);

router.post(
	"/follow-request",
	async (req: express.Request, res: express.Response) => {
		const { user_id, accessToken } = req.body;

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

			const followUser = await createFollowRelation(parsed_user_id, user_id);

			res.status(200).json(followUser);
		} catch (error) {
			if (error instanceof jwt.JsonWebTokenError) {
				res.status(403).json('Invalid access token');
			} else {
				res.status(500).json(`Internal server error: ${(error as Error).message}`);
			}
		}
	}
);

router.post(
	"/un-follow-request",
	async (req: express.Request, res: express.Response) => {
		const { user_id, accessToken } = req.body;

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

			const followUser = await deleteFollowRelation(parsed_user_id, user_id);

			res.status(200).json(followUser);
		} catch (error) {
			if (error instanceof jwt.JsonWebTokenError) {
				res.status(403).json('Invalid access token');
			} else {
				res.status(500).json(`Internal server error: ${(error as Error).message}`);
			}
		}
	}
);

router.get(
	"/get-follow-status/:user_id/:accessToken",
	async (req: express.Request, res: express.Response) => {
		try {
			let parsed_user_id;
			const { user_id, accessToken} = req.params;
			if (!user_id || !accessToken) {
				return res.status(405).json("Missing attributes");
			}

			const decodedToken = jwt.verify(accessToken, config.accessTokenSecret);


			if (typeof decodedToken === "object" && "user_id" in decodedToken) {
				parsed_user_id = decodedToken.user_id;
			} else {
				return res.status(401).json({ error: "User token does not have user" });
			}

			const followStatus = await checkFollowExists(parsed_user_id, user_id);

			res.json({followStatus});
		} catch (error) {
			if (error instanceof jwt.JsonWebTokenError) {
				res.status(403).json('Invalid access token');
			} else {
				res.status(500).json(`Internal server error: ${(error as Error).message}`);
			}
		}
	}
);

router.get(
	"/get-followers/:user_id",
	async (req: express.Request, res: express.Response) => {
		try {
			const { user_id } = req.params;
			if (!user_id) {
				return res.status(405).json("No user ID");
			}
			const user = await getFollowersList(user_id);
			if (!user) {
				return res.status(404).json("No followers found");
			}
			res.json(user);
		} catch (error) {
			return res.status(500).json(`Error: ${(error as Error).message}`);
		}
	}
);

router.get(
	"/get-following/:user_id",
	async (req: express.Request, res: express.Response) => {
		try {
			const { user_id } = req.params;
			if (!user_id) {
				return res.status(405).json("No user ID");
			}
			const user = await getFollowingList(user_id);
			if (!user) {
				return res.status(404).json("No followers found");
			}
			res.json(user);
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
			const followerCount = await getFollowerCount(user_id);
			const followingCount = await getFollowingCount(user_id);

			res.json({user, followerCount, followingCount});
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
