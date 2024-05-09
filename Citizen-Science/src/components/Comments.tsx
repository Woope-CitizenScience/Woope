import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createComment, deleteComment, likeComment, unlikeComment } from '../api/comments';
import { Comment } from '../api/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    const [commentsState, setCommentsState] = useState(comments);
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

    const handleDeletePostComment = async (commentToDelete: Comment) => {
        if (userId === commentToDelete.user_id) {
            try {
                deleteComment(commentToDelete.comment_id);
                onDeleteComment(postId, commentToDelete.comment_id);
            } catch (error) {
                console.error('Error deleting comment:', error);
                Alert.alert('Error', 'Failed to delete comment.');
            }
        }
    };

    const toggleLike = async (comment: Comment) => {
        const index = commentsState.findIndex(c => c.comment_id === comment.comment_id);
        if (index !== -1) {
            const updatedComment = { ...commentsState[index] };
            try {
                if (updatedComment.likedByUser) {
                    await unlikeComment(updatedComment.comment_id);
                    updatedComment.likedByUser = false;
                } else {
                    await likeComment(updatedComment.comment_id);
                    updatedComment.likedByUser = true;
                }
                setCommentsState(state => state.map((item, idx) => idx === index ? updatedComment : item));
            } catch (error) {
                console.error('Error updating like status:', error);
                Alert.alert('Error', 'Failed to update like status.');
            }
        }
    };



    const renderComments = (comments: Comment[]) => {
        return comments.map((comment) => (
            <View key={comment.comment_id} style={styles.comment}>
                <View style={styles.commentHeader}>
                    <Text style={styles.author}>{comment.username}</Text>
                    {userId === comment.user_id && (
                        <TouchableOpacity
                            onPress={() => handleDeletePostComment(comment)}
                        >
                            <MaterialCommunityIcons name="delete" size={18} color="red" />
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.text}>{comment.content}</Text>
                <View style={styles.likeSection}>
                    <TouchableOpacity onPress={() => toggleLike(comment)}>
                        <MaterialCommunityIcons
                            name={comment.likedByUser ? "heart" : "heart-outline"}
                            size={15}
                            color={comment.likedByUser ? "red" : "black"}
                        />
                    </TouchableOpacity>
                </View>
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
        flex: 1,
        padding: 10,
    },
    comment: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    author: {
        fontWeight: 'bold',
    },
    text: {
        fontSize: 14,
        marginBottom: 5,
    },
    likeSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    postButton: {
        marginLeft: 10,
        color: '#007BFF',
        fontWeight: 'bold',
    },
});

export default Comments;

