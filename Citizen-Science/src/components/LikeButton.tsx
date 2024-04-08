import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { likePost, unlikePost } from "../api/posts";

interface LikeButtonProps {
    postId: number;
    user_id: number;
    initialLikesCount?: number;
    likedPost: boolean;
}

// Assuming likePost and unlikePost are async functions that return the updated likes count
const LikeButton: React.FC<LikeButtonProps> = ({ postId, user_id, initialLikesCount = 0, likedPost }) => {
    const [liked, setLiked] = useState(Boolean(likedPost));
    const [likesCount, setLikesCount] = useState(initialLikesCount);

    const toggleLike = async () => {
        if (liked) {
            try {
                await unlikePost(postId, user_id);
                setLikesCount(likesCount - 1); // Corrected decrement
            } catch (error) {
                console.error('Error unliking post:', error);
            }
        } else {
            try {
                await likePost(postId, user_id);
                setLikesCount(likesCount + 1); // Corrected increment
            } catch (error) {
                console.error('Error liking post:', error);
            }
        }
        setLiked(!liked);
    
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 12 }}>
            <Pressable onPress={toggleLike} style={styles.LikeButton}>
                <MaterialCommunityIcons
                    name={liked ? "heart" : "heart-outline"}
                    size={24}
                    color={liked ? "red" : "black"}
                />
            </Pressable>
            <Text style={{ marginLeft: 5 }}>{likesCount}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    LikeButton: {
        marginLeft: 7,
    },

});
export default LikeButton;