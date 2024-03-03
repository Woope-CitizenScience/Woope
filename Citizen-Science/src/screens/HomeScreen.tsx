import React, { useContext, useState } from 'react';
import { StyleSheet, Image, Text, View, TouchableOpacity, TextInput, Alert, FlatList, Dimensions, Modal, Animated, PanResponder } from 'react-native';
import { AuthContext } from '../util/AuthContext';
import { jwtDecode } from 'jwt-decode';
import "core-js/stable/atob";
import {AccessToken, deleteToken} from "../util/token";
import {logoutUser} from "../api/auth";
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import * as DocumentPicker from 'expo-document-picker';
import { MaterialIcons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import Comments from '../components/Comments';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

type PdfFile = {
	uri: string;
	name: string;
};
type Post = {
	image: string[];
	text: string;
	id: string;
	pdfs: PdfFile[];
	comments: Comment[];
	timestamp: number;
};
type Comment = {
	author: string;
	text: string;
};
const HomeScreen = () => {
	const { userToken, setUserToken } = useContext(AuthContext);
	const [data, setData] = useState(null);
	const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
	const userId = decodedToken ? decodedToken.user_id : null;
	const [isPosting, setIsPosting] = useState(false);
	const [postText, setPostText] = useState('');
	const [postImages, setPostImages] = useState<string[]>([]);
	const [posts, setPosts] = useState<Post[]>([]);
	const [error, setError] = useState("");
	const [postPdfs, setPostPdfs] = useState<PdfFile[]>([]);
	const [isImageViewVisible, setImageViewVisible] = useState(false);
	const [selectedImageUri, setSelectedImageUri] = useState('');
	const [selectedPost, setSelectedPost] = useState<Post | null>(null);
	const [commentsModalVisible, setCommentsModalVisible] = useState(false);
	const [modalY] = useState(new Animated.Value(0));
	const firstName = decodedToken ? decodedToken.firstName : null;
	const lastName = decodedToken ? decodedToken.lastName : null;

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			aspect: [4, 3],
			quality: 1,
			allowsMultipleSelection: true,
		});
		if (!result.canceled && result.assets && result.assets.length > 0) {
			const uris = result.assets.map(asset => asset.uri);
			setPostImages(prevImages => [...prevImages, ...uris]);
		}
	};

	const pickPdf = async () => {
		try {
			if (postPdfs.length < 10) {
				const result = await DocumentPicker.getDocumentAsync({
					type: 'application/pdf',
					copyToCacheDirectory: true,
					multiple: true,
				});

				if (!result.canceled && result.assets) {
					const newPdfFiles = result.assets.map(asset => ({
						uri: asset.uri,
						name: asset.name || 'Unknown Name',
					}));

					setPostPdfs(prev => [...prev, ...newPdfFiles]);
				} else {
					console.log('No PDF was selected.');
				}
			} else {
				Alert.alert('Limit Reached', 'You can only select up to ten PDF files.');
			}
		} catch (error) {
			console.error('Error picking PDFs:', error);
		}
	};
	const handleOpenPdf = async (pdfUri: string) => {
		try {
			const isAvailable = await Sharing.isAvailableAsync();
			if (isAvailable) {
				await Sharing.shareAsync(pdfUri);
			} else {
				alert('Sharing is not available');
			}
		} catch (error) {
			alert('An error occurred while trying to share the PDF.');
			console.error(error);
		}
	};

	const handleImagePress = (uri: string) => {
		setSelectedImageUri(uri);
		setImageViewVisible(true);
	};

	const toggleCommentsModal = (post?: Post) => {
		setSelectedPost(post || null);
		setCommentsModalVisible(!commentsModalVisible);
	};
	const onAddComment = (postId: string, newComment: Comment) => {
		const updatedPosts = posts.map(post => {
			if (post.id === postId) {
				return { ...post, comments: [...post.comments, newComment] };
			}
			return post;
		});
		setPosts(updatedPosts);
	};

	const handleSubmit = () => {
		setError("");
		if (postText || postImages.length || postPdfs.length) {
			const uniqueId = Date.now().toString();
			const newPost: Post = {
				id: uniqueId,
				text: postText,
				image: postImages,
				pdfs: postPdfs,
				comments: [],
				timestamp: Date.now(),
			};
			setPosts(prevPosts => [newPost, ...prevPosts]);
			setPostText('');
			setPostImages([]);
			setPostPdfs([]);
			setIsPosting(false);
		} else {
			setError("Please provide text, an image, or a PDF.");
		}
	};

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: () => true,
		onPanResponderMove: Animated.event([null, {
			dy: modalY,
		}], { useNativeDriver: false }),
		onPanResponderRelease: (e, gestureState) => {
			if (gestureState.dy > 100) {
				toggleCommentsModal();
			} else {
				Animated.spring(modalY, {
					toValue: 0,
					useNativeDriver: true,
				}).start();
			}
		},
	});

	const modalStyle = {
		transform: [{
			translateY: modalY.interpolate({
				inputRange: [0, 100],
				outputRange: [0, 100],
				extrapolate: 'clamp',
			})
		}]
	};

	function checkNames(firstName: string | null, lastName: string | null) {
		if (firstName === null && lastName === null) {
			return "Community Forum";
		} else if (firstName === null) {
			return "" + lastName;
		} else if (lastName === null) {
			return "" + firstName;
		} else {
			return firstName + " " + lastName;
		}
	}

	const handleLogout = async () => {
		if (!userId) {
			console.log("No user ID available for logout.");
			return;
		}

		try {
			const response = await logoutUser(userId)

			await deleteToken('accessToken');
			setUserToken(null);
		} catch (error) {
			console.error('Logout error:', error);
		}
	};


	return (
	<View style={styles.flexContainer}>
		{data && <Text>{JSON.stringify(data, null, 2)}</Text>}
		<TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
			<MaterialIcons name="logout" size={24} color="black" />
		</TouchableOpacity>
		<KeyboardAwareFlatList
			data={posts}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<View style={styles.post}>
					<View style={styles.headerRow}>
						<Image source={{ uri: 'https://wallpapercave.com/wp/wp4008083.jpg' }} style={styles.avatar} />
						<View style={styles.headerTextContainer}>
							<Text style={styles.userName}>{checkNames(firstName, lastName)}</Text>
							<Text style={styles.timestamp}>
								{new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
							</Text>
						</View>
					</View>
					{item.text && <Text style={styles.postText}>{item.text}</Text>}
					{item.image.length > 0 && (
						<FlatList
							data={item.image}
							renderItem={({ item: uri }) => (
								<TouchableOpacity onPress={() => handleImagePress(uri)}>
									<Image source={{ uri }} style={styles.fullWidthImage} />
								</TouchableOpacity>
							)}
							horizontal
							pagingEnabled={true}
							showsHorizontalScrollIndicator={false}
							snapToAlignment="center"
							snapToInterval={Dimensions.get('window').width}
						/>
					)}
					{item.pdfs.map((pdf: PdfFile, index: number) => (
						<View key={index} style={styles.pdfItem}>
							<TouchableOpacity onPress={() => handleOpenPdf(pdf.uri)}>
								<MaterialIcons name="picture-as-pdf" size={24} color="red" />
								<Text style={styles.pdfName}>{pdf.name}</Text>
							</TouchableOpacity>
						</View>
					))}
					<TouchableOpacity onPress={() => toggleCommentsModal(item)} style={styles.commentButton}>
						<MaterialIcons name="comment" size={24} color="#007AFF" />
						<Text style={{ color: '#007AFF', marginLeft: 4 }}>{item.comments.length}</Text>
					</TouchableOpacity>
				</View>
			)}
			ListHeaderComponent={
				<>
					<TouchableOpacity style={styles.postBox} onPress={() => setIsPosting(true)}>
						<View style={styles.postBoxInner}>
							<Text style={styles.postBoxText}>What's on your mind?</Text>
						</View>
					</TouchableOpacity>
					{isPosting && (
						<View style={styles.inputContainer}>
							<TextInput
								style={styles.input}
								placeholder="Describe here the details of your post"
								value={postText}
								onChangeText={setPostText}
								multiline
								numberOfLines={4}
							/>
							<View style={styles.iconsContainer}>
								<TouchableOpacity onPress={pickImage}>
									<Text>🖼️</Text>
								</TouchableOpacity>
								{postImages.map((uri, index) => (
									<View key={index}>
										<Text>Image {index + 1}</Text>
									</View>
								))}
								<TouchableOpacity onPress={pickPdf}>
									<Text>📄</Text>
								</TouchableOpacity>
								{postPdfs.map((pdf, index) => (
									<View key={index}>
										<Text>PDF {index + 1}: {pdf.name}</Text>
									</View>
								))}
							</View>
							{postImages.map((uri, index) => (
								<Image key={index} source={{ uri }} style={styles.previewImage} />
							))}
							<TouchableOpacity style={styles.postButton} onPress={handleSubmit}>
								<Text style={styles.postButtonText}>POST</Text>
							</TouchableOpacity>
							{error ? <Text style={styles.errorText}>{error}</Text> : null}
						</View>
					)}
				</>
			}
			showsVerticalScrollIndicator={false}
		/>
		<Modal
			animationType="slide"
			transparent={true}
			visible={isImageViewVisible}
			onRequestClose={() => {
				setImageViewVisible(!isImageViewVisible);
			}}>
			<View style={styles.centeredView}>
				<TouchableOpacity
					style={styles.closeButton}
					onPress={() => setImageViewVisible(false)}>
					<Text style={styles.closeButtonText}>X</Text>
				</TouchableOpacity>
				<Image source={{ uri: selectedImageUri }} style={styles.fullScreenImage} />
			</View>
		</Modal>
		<Modal
			animationType="slide"
			transparent={true}
			visible={commentsModalVisible}
			onRequestClose={() => toggleCommentsModal()}>
			<View style={styles.centeredViews}>
				<Animated.View
					style={[styles.modalView, modalStyle]}
					{...panResponder.panHandlers}>
					{selectedPost && (
						<Comments comments={selectedPost.comments} postId={selectedPost.id} onAddComment={onAddComment} />
					)}
				</Animated.View>
			</View>
		</Modal>
	</View>
	);
};

const styles = StyleSheet.create({
	flexContainer: {
		flex: 1,
		padding: 22,
	},
	postBox: {
		backgroundColor: '#B4D7EE',
		borderRadius: 30,
		paddingVertical: 20,
		paddingHorizontal: 15,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'stretch',
		marginHorizontal: 10,
		marginBottom: 40,
		borderWidth: 1,
		borderColor: '#E7F3FD',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 6,
		elevation: 5,
		marginTop: 6,
	},
	postBoxInner: {
		borderRadius: 20,
		borderWidth: 1,
		borderColor: 'transparent',
		alignSelf: 'stretch',
		borderBottomWidth: 1,
		borderBottomColor: '#D1E3FA',
	},
	postBoxText: {
		fontSize: 16,
		color: '#333',
		padding: 10,
		backgroundColor: '#FFFFFF',
		borderRadius: 18,
		overflow: 'hidden',
		textAlign: 'center',
	},
	inputContainer: {
		width: '90%',
		alignSelf: 'center',
		paddingHorizontal: 15,
		paddingVertical: 20,
		borderRadius: 10,
		backgroundColor: '#FFFFFF',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		marginBottom: 20,
		marginTop: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: '#D1E3FA',
		borderRadius: 20,
		padding: 15,
		width: '100%',
		marginBottom: 10,
	},
	previewImage: {
		width: '100%',
		height: undefined,
		aspectRatio: 4 / 3,
		borderRadius: 10,
		marginBottom: 10,
	},
	postButton: {
		backgroundColor: '#007AFF',
		borderRadius: 20,
		marginTop: 10,
		width: wp('30%'),
		alignSelf: 'flex-end',
		paddingVertical: hp('1.5%'),
		paddingHorizontal: wp('8%'),
	},
	postButtonText: {
		color: '#FFFFFF',
		textAlign: 'center',
		fontSize: 16,
	},
	iconsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		justifyContent: 'flex-start',
		marginBottom: 10,
	},
	post: {
		borderWidth: 1,
		borderColor: '#ccd0d5',
		borderRadius: 10,
		padding: 20,
		backgroundColor: '#fff',
		marginBottom: 10,
		alignItems: 'flex-start',
		width: '100%',
	},
	postText: {
		marginBottom: 10,
		color: '#1c1e21',
	},
	postImage: {
		width: 100,
		height: 100,
		borderRadius: 10,
		marginRight: 10,
	},
	errorText: {
		color: 'red',
		marginTop: 10,
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginBottom: 20,
	},
	pdfAttachedText: {
		marginTop: 10,
		color: '#007AFF',
		fontWeight: 'bold',
	},
	pdfItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	pdfName: {
		marginLeft: 10,
	},
	imagesContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'flex-start',
	},
	imageItem: {
		width: '30%',
		aspectRatio: 1,
		margin: '1%',
	},
	image: {
		width: '100%',
		height: '100%',
		borderRadius: 10,
	},
	fullWidthImage: {
		width: Dimensions.get('window').width,
		height: 400,
		aspectRatio: 1,
		resizeMode: 'contain',
		alignItems: 'center',
		justifyContent: 'center'
	},
	imageWrapper: {
		width: Dimensions.get('window').width,
		alignItems: 'center',
		justifyContent: 'center',
		resizeMode: 'contain',
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
	},
	fullScreenImage: {
		width: '90%',
		height: '80%',
		resizeMode: 'contain',
	},
	closeButton: {
		position: 'absolute',
		top: 50,
		right: 20,
		backgroundColor: 'red',
		padding: 10,
		borderRadius: 10,
	},
	closeButtonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	commentButton: {
		marginTop: 10,
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	centeredViews: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalView: {
		backgroundColor: "white",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 35,
		elevation: 5,
		width: '100%',
		height: '60%',
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 10,
	},
	headerTextContainer: {
		marginLeft: 10,
		justifyContent: 'center',
	},
	userName: {
		fontSize: 16,
		marginBottom: 4,
	},
	timestamp: {
		fontSize: 12,
		color: '#999',
	},
	logoutButton: {
		padding: 5,
		backgroundColor: 'lightblue',
		borderRadius: 5,
		alignSelf: 'flex-start',
		marginTop: -20,
	},
});

export default HomeScreen;
