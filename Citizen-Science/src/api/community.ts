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
