import React, { useState } from "react";
import {View, Text, Pressable, StyleSheet} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LikeButton = () => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const toggleLike = () => {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikesCount(likesCount + (newLikedState ? 1 : -1));
    };

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Pressable onPress={toggleLike} style={styles.LikeButton}>
                <MaterialCommunityIcons
                    name={liked ? "heart" : "heart-outline"}
                    size={24}
                    color={liked ? "red" : "black"}
                />
            </Pressable>
            <Text style={{ marginLeft: 8 }}>{likesCount}</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    LikeButton: {
    marginLeft: 10,
    },

});
export default LikeButton;
