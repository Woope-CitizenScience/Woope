import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createComment, deleteComment, likeComment, unlikeComment } from '../api/comments';
import { Comment } from '../api/types';
import { ScrollView } from 'react-native-gesture-handler';

interface CommentsProps {
    comments: Comment[];
    postId: number;
    userId: number;
    onAddComment: (postId: number, comment: Comment) => void;
    onDeleteComment: (commentId: number) => void;
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
                // Adjust according to your `createComment` API signature
                const createdComment = await createComment(newCommentText, userId, postId);
                onAddComment(postId, createdComment);
                setNewCommentText('');
            } catch (error) {
                console.error('Error creating comment:', error);
                // Handle error (e.g., show an alert)
                Alert.alert('Error', 'Failed to create comment.');
            }
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await deleteComment(commentId);
            onDeleteComment(commentId); // Handle deleting comment in parent component state
        } catch (error) {
            console.error('Error deleting comment:', error);
            Alert.alert('Error', 'Failed to delete comment.');
        }
    };

    const handleLikeComment = async (commentId: number) => {
        try {
            await likeComment(commentId);
            onLikeComment(commentId); // Handle liking comment in parent component state
        } catch (error) {
            console.error('Error liking comment:', error);
            Alert.alert('Error', 'Failed to like comment.');
        }
    };

    const handleUnlikeComment = async (commentId: number) => {
        try {
            await unlikeComment(commentId);
            onUnlikeComment(commentId); // Handle unliking comment in parent component state
        } catch (error) {
            console.error('Error unliking comment:', error);
            Alert.alert('Error', 'Failed to unlike comment.');
        }
    };

    return (
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled={true} enableOnAndroid={true} extraScrollHeight={100} extraHeight={130}>
            <View style={styles.container}>
                {comments.length === 0 && comments.map((comment, index) => (
                    <View key={index} style={styles.comment}>
                        <Text style={styles.author}>{comment.user_id}</Text>
                        <Text style={styles.text}>{comment.content}</Text>
                        <TouchableOpacity onPress={() => handleDeleteComment(comment.comment_id)}>
                            <Text style={styles.postButton}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleLikeComment(comment.comment_id)}>
                            <Text style={styles.postButton}>Like</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleUnlikeComment(comment.comment_id)}>
                            <Text style={styles.postButton}>Unlike</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newCommentText}
                    onChangeText={setNewCommentText}
                    placeholder="Add a comment..."
                    onFocus={() => console.log('Focused')}
                    onBlur={() => console.log('Blurred')}
                    editable={true}
                    onSubmitEditing={handleNewCommentSubmit}
                    multiline={true}
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
        marginTop: 0,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 2,
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