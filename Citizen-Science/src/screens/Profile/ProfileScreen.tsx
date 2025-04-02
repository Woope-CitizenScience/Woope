import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import {
  checkFollowStatus,
  followProfile,
  getProfile,
  unfollowProfile,
} from "../../api/community";
import React, { useCallback, useContext, useEffect, useState } from "react";
import IconButton from "../../components/IconButton";

import { jwtDecode } from "jwt-decode";
import { AccessToken } from "../../util/token";
import { AuthContext } from "../../util/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import LikeButton from "../../components/LikeButton";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { PdfFile, PostWithUsername } from "../../api/types";
import { getPostById, getPostByUserId } from "../../api/posts";

interface ProfileScreenProps {
  route: any;
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ route, navigation }) => {
  const { userID } = route.params;

  let { userToken } = useContext(AuthContext);
  const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
  const currentUserID = decodedToken ? decodedToken.user_id : null;

  const [profileOwner, setProfileOwner] = useState(false);

  const [fullyLoaded, setFullyLoaded] = useState(false);

  const [editFirstName, setFirstName] = useState("");
  const [editLastName, setLastName] = useState("");

  const [posts, setPosts] = useState<any[]>([]);

  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState("");
  const [followingCount, setFollowingCount] = useState("");

  {
    /* Loads profile */
  }
  const fetchProfile = useCallback(() => {
    setFullyLoaded(false);
    if (userID === currentUserID) {
      setProfileOwner(true);
    } else {
      setProfileOwner(false);
    }
    getProfile(userID)
      .then((data) => {
        setFirstName(data.user.first_name);
        setLastName(data.user.last_name);

        setFollowerCount(data.followerCount.follower_of_count);
        setFollowingCount(data.followingCount.following_of_count);
        setFullyLoaded(true);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
    getPostByUserId(userID).then((data) => {
      setPosts(data);
    });
    {
      /* Un-needed api calls if looking at own profile */
    }
    if (!profileOwner) {
      checkFollowStatus(userID, userToken)
        .then((data) => {
          if (data !== 0) {
            if (data.followStatus.status === 1) {
              setFollowing(true);
            }
          } else {
            setFollowing(false);
          }
        })
        .catch((error) => {
          console.error("Error: ", error);
        });
    }
  }, [userID, currentUserID]);

  {
    /* Reload profile upon focusing screen */
  }
  useFocusEffect(fetchProfile);

  {
    /* Call followProfile api and client side update screen */
  }
  const handleFollowProfile = async () => {
    try {
      if (!following) {
        const user = await followProfile(userID, userToken);
        setFollowing(true);
      }
    } catch (error) {
      console.error("Errors: ", error);
    }
  };

  {
    /* Call unfollowProfile api and client side update screen */
  }
  const handleUnfollowProfile = async () => {
    try {
      if (following) {
        const user = await unfollowProfile(userID, userToken);
        setFollowing(false);
      }
    } catch (error) {
      console.error("Errors: ", error);
    }
  };

  if (!fullyLoaded) {
    return (
      <View
        style={{
          alignContent: "flex-start",
          paddingTop: responsiveHeight(10),
        }}
      >
        <ActivityIndicator size={"large"} color={"lightblue"} />
      </View>
    );
  }
  function handleImagePress(uri: string): void {
    throw new Error("Function not implemented.");
  }

  function toggleCommentsModal(
    item:
      | {
          post_id: string;
          content: string;
          created_at: number;
          image: string;
          like_count: number;
        }
      | {
          post_id: string;
          content: string;
          created_at: number;
          image: string;
          like_count?: undefined;
        }
  ): void {
    throw new Error("Function not implemented.");
  }

  function setVisibleDropdown(arg0: string | null): void {
    throw new Error("Function not implemented.");
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={[{ width: responsiveWidth(100) }]}
        data={posts}
        keyExtractor={(item) => "" + item.post_id}
        // numColumns={3}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={!fullyLoaded} onRefresh={fetchProfile} />
        }
        ListHeaderComponent={
          <>
            <View style={styles.profileUser}>
              {/* temp For Profile Picture */}
              <View
                style={{
                  height: responsiveHeight(9),
                  width: responsiveHeight(9),
                  borderRadius: 50,
                  backgroundColor: "lightblue",
                }}
              ></View>
              {/* Posts, Followers, Following */}
              <View style={styles.attributes}>
                <TouchableOpacity
                  onPress={void 0}
                  style={styles.textAttributes}
                >
                  <Text style={styles.textUserInfo}>Posts</Text>
                  <Text style={styles.textUserInfo}>{posts.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ProfileFollowersScreen", {
                      userID: userID,
                    })
                  }
                  style={styles.textAttributes}
                >
                  <Text style={styles.textUserInfo}>{"Followers "}</Text>
                  <Text style={styles.textUserInfo}>{followerCount}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ProfileFollowingScreen", {
                      userID: userID,
                    })
                  }
                  style={styles.textAttributes}
                >
                  <Text style={styles.textUserInfo}>{"Following "}</Text>
                  <Text style={styles.textUserInfo}>{followingCount}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Name */}
            <Text
              style={{
                fontSize: responsiveFontSize(1.8),
                fontWeight: "bold",
                color: "black",
                paddingStart: responsiveWidth(2),
                paddingBottom: responsiveHeight(1),
                backgroundColor: "transparent",
              }}
            >
              {editFirstName + " " + editLastName}
            </Text>
            {profileOwner && (
              <View
                style={[
                  styles.attributes,
                  {
                    paddingHorizontal: responsiveWidth(2),
                    paddingBottom: responsiveHeight(1),
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("ProfileEditScreen")}
                  style={styles.iconStyle}
                >
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.8),
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    Edit Profile
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {!profileOwner && (
              <View
                style={[
                  styles.attributes,
                  {
                    paddingHorizontal: responsiveWidth(2),
                    paddingBottom: responsiveHeight(1),
                  },
                ]}
              >
                {!following && (
                  <TouchableOpacity
                    onPress={() => handleFollowProfile()}
                    style={styles.iconStyle}
                  >
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.8),
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      Follow Profile
                    </Text>
                  </TouchableOpacity>
                )}
                {following && (
                  <TouchableOpacity
                    onPress={() => handleUnfollowProfile()}
                    style={styles.iconStyle}
                  >
                    <Text
                      style={{
                        fontSize: responsiveFontSize(1.8),
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      Following
                    </Text>
                  </TouchableOpacity>
                )}

                {/* <TouchableOpacity onPress={void 0} style={styles.iconStyle}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.8),
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    Share Profile
                  </Text>
                </TouchableOpacity> */}
              </View>
            )}
          </>
        }
        // renderItem={({ item, index }) => {
        //   let marginLeft = 0;
        //   let marginRight = 0;
        //   let marginBottom = responsiveWidth(0.5);
        //   if (index % 3 === 1) {
        //     marginLeft = responsiveWidth(0.5);
        //     marginRight = responsiveWidth(0.5);
        //   }
        //   return (
        //     <View
        //       style={[
        //         styles.posts,
        //         {
        //           marginRight,
        //           marginLeft,
        //           marginBottom,
        //           backgroundColor: "grey",
        //         },
        //       ]}
        //     >
        //       <Text
        //         style={[
        //           {
        //             height: responsiveWidth(33),
        //             width: responsiveWidth(33),
        //             backgroundColor: "transparent",
        //           },
        //         ]}
        //       >
        //         {item.content}
        //       </Text>
        //     </View>
        //   );
        // }}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <View style={styles.headerRow}>
              <Image
                source={{ uri: "https://wallpapercave.com/wp/wp4008085.jpg" }}
                style={styles.avatar}
              />
              <View style={styles.headerTextContainer}>
                <Text style={styles.userName}>
                  {editFirstName + " " + editLastName}
                </Text>
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
            {/* {item.pdfs?.map((pdf: PdfFile, index: number) => (
              <View key={pdf.uri} style={styles.pdfItem}>
                {" "}
                // Make sure pdf.uri is unique
                <TouchableOpacity onPress={() => handleOpenPdf(pdf.uri)}>
                  <MaterialIcons name="picture-as-pdf" size={24} color="red" />
                  <Text style={styles.pdfName}>{pdf.name}</Text>
                </TouchableOpacity>
              </View>
            ))} */}
            {/* <TouchableOpacity
              onPress={() => toggleCommentsModal(item)}
              style={styles.commentButton}
            > */}
            {/* <LikeButton
                postId={item.post_id}
                user_id={userId}
                initialLikesCount={item.likes_count}
                likedPost={item.user_liked}
              /> */}
            <MaterialIcons name="comment" size={24} color="#007AFF" />
            {/* <Text style={{ color: "#007AFF", marginLeft: 4 }}>
                {(commentsMap[item.post_id] || []).length}
              </Text> */}
            {/* </TouchableOpacity> */}
            {/* {userCanModifyPost(item) && (
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
            )} */}
            {/* {visibleDropdown === item.post_id && (
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
            )} */}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  commentButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 20,
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
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  fullWidthImage: {
    width: Dimensions.get("window").width,
    height: 400,
    aspectRatio: 1,
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
  },
  posts: {
    justifyContent: "space-evenly",
    height: responsiveWidth(33),
    width: responsiveWidth(33),
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "white",
    flexDirection: "column",
  },
  profileUser: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "transparent",
    height: responsiveHeight(11),
    width: responsiveWidth(100),
    paddingLeft: responsiveWidth(2),
    flexDirection: "row",
  },
  attributes: {
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  textUserInfo: {
    fontSize: responsiveFontSize(1.8),
    fontWeight: "bold",
    color: "black",
    backgroundColor: "transparent",
    paddingHorizontal: responsiveWidth(3),
  },
  textAttributes: {
    justifyContent: "center",
    alignItems: "center",
    width: responsiveWidth(27),
    height: responsiveHeight(8),
    paddingHorizontal: responsiveWidth(0.5),
    backgroundColor: "transparent",
    borderRadius: responsiveHeight(1),
  },
  iconStyle: {
    justifyContent: "center",
    alignItems: "center",
    width: responsiveWidth(47),
    height: responsiveHeight(4.5),
    paddingHorizontal: responsiveWidth(0.5),
    marginEnd: responsiveWidth(2),
    backgroundColor: "lightblue",
    borderRadius: responsiveHeight(1),
  },
  line: {
    height: responsiveHeight(0.2),
    width: responsiveWidth(90),
    backgroundColor: "black",
    marginBottom: responsiveHeight(1),
  },
});

export default ProfileScreen;
