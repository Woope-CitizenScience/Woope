import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { createComment, deleteComment, likeComment, unlikeComment } from '../api/comments';
import { Comment } from '../api/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { AuthContext } from "../util/AuthContext";
// import { jwtDecode } from "jwt-decode";
// import { AccessToken } from "../util/token";

interface CommentsProps {
    comments: Comment[];
    postId: number;
    userId: number;
    onAddComment: (postId: number, comment: Comment) => void;
    onDeleteComment: (postId: number, commentId: number) => void;
    onLikeComment: (commentId: number) => void;
    onUnlikeComment: (commentId: number) => void;
}

const Comments: React.FC<CommentsProps> = ({
    comments = [],
    postId,
    userId,
    onAddComment,
    onDeleteComment,
    onLikeComment,
    onUnlikeComment,
}) => {
    const [newCommentText, setNewCommentText] = useState('');

    const handleNewCommentSubmit = async () => {
        if (newCommentText.trim()) {
            try {
                const createdComment = await createComment(newCommentText, userId, postId);
                onAddComment(postId, createdComment);
                setNewCommentText('');
            } catch (error) {
                console.error('Error creating comment:', error);
                Alert.alert('Error', 'Failed to create comment.');
            }
        }
    };

    const handleDeletePostComment = async (commentId: number) => {
        try {
            deleteComment(commentId);
            onDeleteComment(postId, commentId);
        } catch (error) {
            console.error('Error deleting comment:', error);
            Alert.alert('Error', 'Failed to delete comment.');
        }
    };

    const renderComments = (comments: Comment[]) => {
        return comments.map((comment) => (
            <View key={comment.comment_id} style={styles.comment}>
                <Text style={styles.author}>{comment.username}</Text>
                <Text style={styles.text}>{comment.content}</Text>
                <TouchableOpacity onPress={() => handleDeletePostComment(comment.comment_id)}>
                    <Text style={styles.postButton}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onLikeComment(comment.comment_id)}>
                    <Text style={styles.postButton}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onUnlikeComment(comment.comment_id)}>
                    <Text style={styles.postButton}>Unlike</Text>
                </TouchableOpacity>
            </View>
        ));
    };

    return (
        <KeyboardAwareScrollView style={{ flex: 1 }} extraScrollHeight={20} enableOnAndroid={true} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                {renderComments(comments)}
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
        marginTop: 5,
        padding: 8,
        backgroundColor: '#f8f8f8',
        borderRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
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
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: '#f2f2f2',
    },
    postButton: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});

export default Comments;