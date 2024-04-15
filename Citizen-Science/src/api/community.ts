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
