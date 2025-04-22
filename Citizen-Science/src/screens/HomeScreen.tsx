import React, { useContext, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Dimensions,
  Modal,
  Animated,
  PanResponder,
  Button,
  SafeAreaView,
  Switch,
} from "react-native";
import { AuthContext } from "../util/AuthContext";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import { AccessToken, deleteToken } from "../util/token";
import { logoutUser } from "../api/auth";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import * as DocumentPicker from "expo-document-picker";
import { MaterialIcons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import Comments from "../components/Comments";
import LikeButton from "../components/LikeButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Weather from "../components/weather";
import {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikedPosts,
} from "../api/posts";
import {
  createComment,
  deleteComment,
  updateComment,
  likeComment,
  unlikeComment,
  getComments,
} from "../api/comments";
import { PdfFile, Post, Comment, PostWithUsername } from "../api/types";
import WelcomeBanner from "../components/WelcomeBanner";
import FixedSwitch from "../components/FixedSwitch";

const HomeScreen = () => {
  const { userToken, setUserToken } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
  const userPermissions = decodedToken
    ? (decodedToken?.permissions)
    : null;
  const userCanDeleteAllPosts = userPermissions
    ? userPermissions.delete_all_posts
    : false;
  const userCanEditAllPosts = userPermissions
    ? userPermissions.edit_all_posts
    : false;
  const userName = decodedToken
    ? decodedToken.firstName + " " + decodedToken.lastName
    : null;
  const userOrgId = decodedToken ? decodedToken.org_id : null;
  const userOrgName = decodedToken ? decodedToken.org_name : null;
  const userId = decodedToken ? decodedToken.user_id : NaN;
  const [postAsOrganization, setPostAsOrganization] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postText, setPostText] = useState("");
  const [postImages, setPostImages] = useState<string[]>([]);
  const [posts, setPosts] = useState<PostWithUsername[]>([]);
  const [error, setError] = useState("");
  const [postPdfs, setPostPdfs] = useState<PdfFile[]>([]);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [selectedPost, setSelectedPost] = useState<PostWithUsername | null>(
    null
  );
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [commentsMap, setCommentsMap] = useState<CommentsMap>({});
  const [visibleDropdown, setVisibleDropdown] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [modalY] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const postTextInputRef = useRef<TextInput>(null);

  interface CommentsMap {
    [key: number]: Comment[];
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      let postsList = await getAllPosts(userId);
      postsList = postsList.filter((post: PostWithUsername) => {
        return post.is_active;
      });
      setPosts(postsList);
      const commentsMap: CommentsMap = {};
      for (const post of postsList) {
        const postComments = await getComments(post.post_id);
        commentsMap[post.post_id] = postComments;
      }
      setCommentsMap(commentsMap);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch posts.");
    }
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uris = result.assets.map((asset) => asset.uri);
      setPostImages((prevImages) => [...prevImages, ...uris]);
    }
  };

  const pickPdf = async () => {
    try {
      if (postPdfs.length < 10) {
        const result = await DocumentPicker.getDocumentAsync({
          type: "application/pdf",
          copyToCacheDirectory: true,
          multiple: true,
        });

        if (!result.canceled && result.assets) {
          const newPdfFiles = result.assets.map((asset) => ({
            uri: asset.uri,
            name: asset.name || "Unknown Name",
          }));

          setPostPdfs((prev) => [...prev, ...newPdfFiles]);
        } else {
          console.log("No PDF was selected.");
        }
      } else {
        Alert.alert(
          "Limit Reached",
          "You can only select up to ten PDF files."
        );
      }
    } catch (error) {
      console.error("Error picking PDFs:", error);
    }
  };

  const handleOpenPdf = async (pdfUri: string) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(pdfUri);
      } else {
        alert("Sharing is not available");
      }
    } catch (error) {
      alert("An error occurred while trying to share the PDF.");
      console.error(error);
    }
  };

  const handleImagePress = (uri: string) => {
    setSelectedImageUri(uri);
    setImageViewVisible(true);
  };

  const toggleCommentsModal = (post?: PostWithUsername) => {
    setSelectedPost(post || null);
    setCommentsModalVisible(!commentsModalVisible);
  };

  const togglePostAsOrg = () => {
    setPostAsOrganization(!postAsOrganization);
  };

  const handleAddComment = (postId: number, newComment: Comment) => {
    setPosts((posts) =>
      posts.map((post) => {
        if (post.post_id === postId) {
          const updatedComments = post.comments
            ? [...post.comments, newComment]
            : [newComment];
          return { ...post, comments: updatedComments };
        }
        return post;
      })
    );
    fetchPosts();
  };

  const handleDeleteComment = (postId: number, commentId: number) => {
    fetchPosts();
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      const response = await likeComment(commentId);
      fetchPosts();
    } catch (error) {
      console.error(error);
      setError("Failed to like post. Please try again.");
    }
  };

  const handleUnlikeComment = async (commentId: number) => {
    try {
      unlikeComment(commentId);
      fetchPosts();
    } catch (error) {
      console.error(error);
      setError("Failed to unlike post. Please try again.");
    }
  };

  const startEditingPost = (postId: number) => {
    const postToEdit = posts.find((post) => post.post_id === postId);
    if (postToEdit) {
      console.log("Editing post:", postToEdit);
      setPostText(postToEdit.content || "");
      setPostImages(postToEdit.image || []);
      setPostPdfs(postToEdit.pdfs || []);

      setIsEditing(true);
      setEditingPostId(postId);
      setVisibleDropdown(null);
      if (postTextInputRef.current) {
        postTextInputRef.current.focus();
      }
    } else {
      console.log("No post found with ID:", postId);
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPostId || !postText.trim()) {
      alert("Post text cannot be empty.");
      return;
    }

    try {
      const updatedPost = await updatePost(editingPostId, postText); // Adjust parameters as needed
      fetchPosts();

      // Reset the form and editing state
      setIsEditing(false);
      setEditingPostId(null);
      setPostText("");
      setPostImages([]);
      setPostPdfs([]);
      setIsPosting(false);
    } catch (error) {
      console.error("Failed to update the post:", error);
    }
  };

  const handleCreatePost = async () => {
    setError("");
    if (!postText.trim()) {
      setError("Please provide text for your post.");
      return;
    } else if (userId === null) {
      setError("Please login to post.");
      return;
    }
    try {
      const postOrgId = postAsOrganization ? userOrgId : NaN;
      await createPost(Number(userId), postOrgId, postText);
      fetchPosts();

      // Clear the form
      setPostText("");
      setPostImages([]);
      setPostPdfs([]);
      setIsPosting(false);
    } catch (error) {
      console.error(error);
      setError("Failed to create post. Please try again.");
    }
  };

  const handleDeletePost = async (postToDelete: PostWithUsername) => {
    setVisibleDropdown(null);
    if (userCanDeletePost(postToDelete)) {
      try {
        deletePost(postToDelete.post_id);
        setPosts((currentPosts) =>
          currentPosts.filter((post) => post.post_id !== postToDelete.post_id)
        );
      } catch (error) {
        console.error(error);
        setError("Failed to delete post. Please try again.");
      } finally {
        fetchPosts();
      }
    }
  };

  const userCanModifyPost = (post: PostWithUsername) => {
    return (
      userId === post.user_id ||
      userCanDeletePost(post) ||
      userCanEditPost(post)
    );
  };

  const userCanDeletePost = (post: PostWithUsername) => {
    return (
      userId === post.user_id ||
      userCanDeleteAllPosts ||
      (userOrgId &&
        userOrgId === post.org_id &&
        userPermissions.delete_org_posts)
    );
  };

  const userCanEditPost = (post: PostWithUsername) => {
    return (
      userId === post.user_id ||
      userCanEditAllPosts ||
      (userOrgId && userOrgId === post.org_id && userPermissions.edit_org_posts)
    );
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dy: modalY,
        },
      ],
      { useNativeDriver: false }
    ),
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
    transform: [
      {
        translateY: modalY.interpolate({
          inputRange: [0, 100],
          outputRange: [0, 100],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  return (
    <>
      <WelcomeBanner />
      <SafeAreaView style={styles.flexContainer}>
        {userPermissions.create_org_posts && userOrgId && (
          <FixedSwitch
            onValueChange={togglePostAsOrg}
            value={postAsOrganization}
          ></FixedSwitch>
        )}
        {data && <Text>{JSON.stringify(data, null, 2)}</Text>}
        <KeyboardAwareFlatList
          data={posts}
          keyExtractor={(item) => item.post_id.toString()}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <View style={styles.headerRow}>
                <Image
                  source={{ uri: "https://wallpapercave.com/wp/wp4008085.jpg" }}
                  style={styles.avatar}
                />
                <View style={styles.headerTextContainer}>
                  <Text style={styles.userName}>{item.userName}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(item.created_at).toLocaleDateString()} at{" "}
                    {new Date(item.created_at).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
              {item.content && (
                <Text style={styles.postText}>{item.content}</Text>
              )}
              {item.image?.length > 0 && (
                <FlatList
                  data={item.image}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item: uri }) => (
                    <TouchableOpacity onPress={() => handleImagePress(uri)}>
                      <Image source={{ uri }} style={styles.fullWidthImage} />
                    </TouchableOpacity>
                  )}
                  horizontal
                  pagingEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  snapToAlignment="center"
                  snapToInterval={Dimensions.get("window").width}
                />
              )}
              {item.pdfs?.map((pdf: PdfFile, index: number) => (
                <View key={pdf.uri} style={styles.pdfItem}>
                  {" "}
                  // Make sure pdf.uri is unique
                  <TouchableOpacity onPress={() => handleOpenPdf(pdf.uri)}>
                    <MaterialIcons
                      name="picture-as-pdf"
                      size={24}
                      color="red"
                    />
                    <Text style={styles.pdfName}>{pdf.name}</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={() => toggleCommentsModal(item)}
                style={styles.commentButton}
              >
                <LikeButton
                  postId={item.post_id}
                  user_id={userId}
                  initialLikesCount={item.likes_count}
                  likedPost={item.user_liked}
                />
                <MaterialIcons name="comment" size={24} color="#007AFF" />
                <Text style={{ color: "#007AFF", marginLeft: 4 }}>
                  {(commentsMap[item.post_id] || []).length}
                </Text>
              </TouchableOpacity>
              {userCanModifyPost(item) && (
                <TouchableOpacity
                  onPress={() =>
                    setVisibleDropdown(
                      visibleDropdown === item.post_id ? null : item.post_id
                    )
                  }
                  style={styles.dropdownIcon}
                >
                  <Text>...</Text>
                </TouchableOpacity>
              )}
              {visibleDropdown === item.post_id && (
                <View style={styles.dropdownMenu}>
                  {userCanEditPost(item) && (
                    <TouchableOpacity
                      onPress={() => startEditingPost(item.post_id)}
                    >
                      <Text style={styles.dropdownItem}>Edit</Text>
                    </TouchableOpacity>
                  )}
                  {userCanDeletePost(item) && (
                    <TouchableOpacity
                      onPress={() => {
                        handleDeletePost(item);
                      }}
                    >
                      <Text style={styles.dropdownItem}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
          ListHeaderComponent={
            <>
              <Weather />
              <TouchableOpacity
                style={styles.postBox}
                onPress={() => setIsPosting(true)}
              >
                <View style={styles.postBoxInner}>
                  <Text style={styles.postBoxText}>What's on your mind?</Text>
                </View>
              </TouchableOpacity>
              {isPosting && (
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={postTextInputRef}
                    style={styles.input}
                    placeholder="What's on your mind?"
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
                        <Text>
                          PDF {index + 1}: {pdf.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                  {postImages.map((uri, index) => (
                    <Image
                      key={index}
                      source={{ uri }}
                      style={styles.previewImage}
                    />
                  ))}
                  <TouchableOpacity
                    style={styles.postButton}
                    onPress={isEditing ? handleUpdatePost : handleCreatePost}
                  >
                    <Text style={styles.postButtonText}>
                      {isEditing ? "UPDATE" : "POST"}
                    </Text>
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
          }}
        >
          <View style={styles.centeredView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setImageViewVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: selectedImageUri }}
              style={styles.fullScreenImage}
            />
          </View>
        </Modal>
        <Modal
          visible={commentsModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => toggleCommentsModal()}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => toggleCommentsModal()}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
              {selectedPost && (
                <Comments
                  comments={commentsMap[selectedPost.post_id] || []}
                  postUserId={selectedPost.user_id}
                  postId={selectedPost.post_id}
                  userId={userId}
                  orgId={postAsOrganization ? userOrgId : NaN}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                  onLikeComment={handleLikeComment}
                  onUnlikeComment={handleUnlikeComment}
                />
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    padding: 22,
  },
  postBox: {
    backgroundColor: "#B4D7EE",
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginHorizontal: 10,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "#E7F3FD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 6,
  },
  postBoxInner: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
    alignSelf: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "#D1E3FA",
  },
  postBoxText: {
    fontSize: 16,
    color: "#333",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    textAlign: "center",
  },
  inputContainer: {
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
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
    borderColor: "#D1E3FA",
    borderRadius: 20,
    padding: 15,
    width: "100%",
    marginBottom: 10,
  },
  orgSwitch: {
    alignSelf: "flex-end",
  },
  previewImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 4 / 3,
    borderRadius: 10,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    marginTop: 10,
    width: wp("30%"),
    alignSelf: "flex-end",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("8%"),
  },
  postButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  post: {
    borderWidth: 1,
    borderColor: "#ccd0d5",
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
    alignItems: "flex-start",
    width: "100%",
  },
  postText: {
    marginBottom: 10,
    color: "#1c1e21",
  },
  postImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  errorText: {
    color: "red",
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
    color: "#007AFF",
    fontWeight: "bold",
  },
  pdfItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  pdfName: {
    marginLeft: 10,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  imageItem: {
    width: "30%",
    aspectRatio: 1,
    margin: "1%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  fullWidthImage: {
    width: Dimensions.get("window").width,
    height: 400,
    aspectRatio: 1,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: Dimensions.get("window").width,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
  },
  fullScreenImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
  },
  commentButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  centeredViews: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  headerTextContainer: {
    marginLeft: 10,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  dropdownIcon: {
    padding: 10,
    fontSize: 20,
    color: "#007AFF",
    position: "absolute",
    top: 10,
    right: 20,
    zIndex: 1,
  },
  dropdownMenu: {
    position: "absolute",
    top: 40,
    right: 10,
    backgroundColor: "#E7F6FF",
    borderRadius: 5,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },

  dropdownItem: {
    padding: 8,
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  dropdownItems: {
    padding: 8,
    fontSize: 14,
    color: "#ff0000",
    fontWeight: "500",
  },
  logoutButton: {
    padding: 5,
    backgroundColor: "lightblue",
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: -20,
  },
  modalView: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 35,
    paddingTop: 120,
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});
export default HomeScreen;
