import AsyncStorage from "@react-native-async-storage/async-storage";
import mime from "mime";

/**
	Updates the name of a user
	@param user_id Unique identifier of the user
	@param firstName First name of user
	@param lastName Last name of user
	@param accessToken The access token for authentication 
*/
export const updateName = async (
	user_id: number,
	firstName: string,
	lastName: string,
	accessToken: any
) => {
	const response = await fetch(
		`${process.env.EXPO_PUBLIC_API_URL}/community/update-name`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_id, firstName, lastName, accessToken }),
		}
	);

	if (!response.ok) {
		const errorResponse = await response.json();
		const error = new Error(errorResponse.error || response.statusText);
		error.name = `HTTP Error ${response.status}`;
		throw error;
	}
	return await response.json();
};

export const updatePfp = async (user_id: string, imageUri: string ) => {
	const formData = new FormData();

	formData.append('user_id', user_id)
	formData.append(`file`, {
		uri: imageUri,
		type: mime.getType(imageUri) || "image/jpeg",
		name: imageUri.split("/").pop()
	  } as unknown as Blob);

	  const token = await AsyncStorage.getItem("accessToken");

	  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/community/update-pfp`, {
		method: 'POST',
		headers: {
		  'Authorization': token ? `Bearer ${token}` : '',
		},
		body: formData,
	  });
	
	  if (!response.ok) {
		const errorResponse = await response.json();
		const error = new Error(errorResponse.error || response.statusText);
		error.name = `HTTP Error ${response.status}`;
		throw error;
	}

	return await response.json();
	
}

/**
	Returns the profile content of a user
	@param user_id Unique identifier of the user
*/
export const getProfile = async (user_id: number) => {
	try {
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_URL}/community/get-profile/${user_id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
};

/**
	Returns a list of followers of a user
	@param user_id Unique identifier of the user
*/
export const getFollowers = async (user_id: number) => {
	try {
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_URL}/community/get-followers/${user_id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			return null;
		} else {
			const data = await response.json();
			return data;
		}
	} catch (error) {
		console.error(error);
	}
};

/**
	Returns a list of users that the specified user follows
	@param user_id Unique identifier of the user
*/
export const getFollowing = async (user_id: number) => {
	try {
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_URL}/community/get-following/${user_id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			return null;
		} else {
			const data = await response.json();
			return data;
		}
	} catch (error) {
		console.error(error);
	}
};

/**
	Attempts to follow the specified user
	@param user_id Unique identifier of the user to be followed
	@param accessToken The access token for authentication
*/
export const followProfile = async (user_id: number, accessToken: any) => {
	const response = await fetch(
		`${process.env.EXPO_PUBLIC_API_URL}/community/follow-request`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_id, accessToken }),
		}
	);

	if (!response.ok) {
		const errorResponse = await response.json();
		const error = new Error(errorResponse.error || response.statusText);
		error.name = `HTTP Error ${response.status}`;
		throw error;
	}
	return await response.json();
};

/**
	Attempts to follow the specified user
	@param user_id Unique identifier of the user to be unfollowed
	@param accessToken The access token for authentication
*/
export const unfollowProfile = async (user_id: number, accessToken: any) => {
	const response = await fetch(
		`${process.env.EXPO_PUBLIC_API_URL}/community/un-follow-request`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_id, accessToken }),
		}
	);

	if (!response.ok) {
		const errorResponse = await response.json();
		const error = new Error(errorResponse.error || response.statusText);
		error.name = `HTTP Error ${response.status}`;
		throw error;
	}
	return await response.json();
};

/**
	Check the follow status between the specified user and accessing user
	@param user_id Unique identifier of the user
	@param accessToken The access token for authentication
*/
export const checkFollowStatus = async (user_id: number, accessToken: any) => {
	try {
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_URL}/community/get-follow-status/${user_id}/${accessToken}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			return 0;
		} else {
			const data = await response.json();
			return data;
		}
	} catch (error) {
		console.error(error);
	}
};

/**
	Attempts to search for specified name
	@param name Search term
*/
export const searchProfile = async (name: string) => {
	try {
		const response = await fetch(
			`${process.env.EXPO_PUBLIC_API_URL}/community/search-profile/${name}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			return null;
		} else {
			const data = await response.json();
			return data;
		}
	} catch (error) {
		console.error(error);
	}
};
