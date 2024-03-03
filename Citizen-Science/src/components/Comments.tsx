import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthContext } from "../util/AuthContext";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "../util/token";

type Comment = {
    author: string;
    text: string;
};

interface CommentsProps {
    comments: Comment[];
    postId: string;
    onAddComment: (postId: string, comment: Comment) => void;
}

const Comments: React.FC<CommentsProps> = ({ comments, postId, onAddComment }) => {
    const [newCommentText, setNewCommentText] = useState('');
    const { userToken } = useContext(AuthContext);
    const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
    const firstName = decodedToken ? decodedToken.firstName : null;
    const lastName = decodedToken ? decodedToken.lastName : null;

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

    const handleNewCommentSubmit = () => {
        if (newCommentText.trim()) {
            const newComment: Comment = {
                author: checkNames(firstName, lastName),
                text: newCommentText,
            };
            onAddComment(postId, newComment);
            setNewCommentText('');
        }
    };

    return (
        <KeyboardAwareScrollView style={{ flex: 1 }} extraScrollHeight={20} enableOnAndroid={true} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                {comments.map((comment, index) => (
                    <View key={index} style={styles.comment}>
                        <Text style={styles.author}>{comment.author}</Text>
                        <Text style={styles.text}>{comment.text}</Text>
                    </View>
                ))}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newCommentText}
                        onChangeText={setNewCommentText}
                        placeholder="Add a comment..."
                        onSubmitEditing={handleNewCommentSubmit}
                    />
                    <TouchableOpacity onPress={handleNewCommentSubmit}>
                        <Text style={styles.postButton}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    comment: {
        flexDirection: 'row',
        marginTop: 5,
    },
    author: {
        fontWeight: 'bold',
        marginRight: 8,
    },
    text: {
        flexShrink: 1,
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#f2f2f2',
    },
    postButton: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});

export default Comments;