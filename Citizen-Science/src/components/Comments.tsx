import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { createComment, deleteComment, likeComment, unlikeComment } from '../api/comments';
import { Comment } from '../api/types';

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
        console.log('Submitting new comment:');
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

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                {comments.map((comment, index) => (
                    <View key={index} style={styles.comment}>
                        <Text style={styles.author}>{comment.user_id}</Text>
                        <Text style={styles.text}>{comment.content}</Text>
                        <TouchableOpacity onPress={() => onDeleteComment(comment.comment_id)}>
                            <Text style={styles.postButton}>Delete</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onLikeComment(comment.comment_id)}>
                            <Text style={styles.postButton}>Like</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onUnlikeComment(comment.comment_id)}>
                            <Text style={styles.postButton}>Unlike</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        autoFocus={true}
                        value={newCommentText}
                        onChangeText={setNewCommentText}
                        placeholder="Add a comment..."
                        multiline={true}
                        returnKeyType="send"
                        onSubmitEditing={handleNewCommentSubmit}
                    />
                    <TouchableOpacity onPress={() => { 
                        console.log('Button pressed'); 
                        handleNewCommentSubmit(); 
                    }}>
                        <Text style={styles.postButton}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
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
