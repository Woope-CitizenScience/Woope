import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthContext } from "../util/AuthContext";
import { jwtDecode } from "jwt-decode";
import { AccessToken } from "../util/token";

type Comment = {
    id: string;
    author: string;
    text: string;
    replies?: Comment[];
};

interface CommentsProps {
    comments: Comment[];
    postId: string;
    onAddComment: (postId: string, comment: Comment) => void;
    onAddReply: (postId: string, commentId: string, reply: Comment) => void;
}

const Comments: React.FC<CommentsProps> = ({ comments, postId, onAddComment, onAddReply }) => {
    const [newCommentText, setNewCommentText] = useState('');
    const { userToken } = useContext(AuthContext);
    const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
    const firstName = decodedToken ? decodedToken.firstName : null;
    const lastName = decodedToken ? decodedToken.lastName : null;
    const [activeReplyBoxes, setActiveReplyBoxes] = useState<{ [commentId: string]: boolean }>({});


    function checkNames(firstName: string | null, lastName: string | null) {
        if (firstName === null && lastName === null) {
            return "Community Forum";
        } else if (firstName === null) {
            return lastName || '';
        } else if (lastName === null) {
            return firstName || '';
        } else {
            return `${firstName} ${lastName}`;
        }
    }

    const handleNewCommentSubmit = () => {
        if (newCommentText.trim()) {
            const newComment: Comment = {
                id: Math.random().toString(36).substring(2, 9),
                author: checkNames(firstName, lastName),
                text: newCommentText,
                replies: [],
            };
            onAddComment(postId, newComment);
            setNewCommentText('');
        }
    };

    const handleNewReplySubmit = (parentId: string) => {
        if (newCommentText.trim()) {
            const newReply: Comment = {
                id: Math.random().toString(36).substring(2, 9),
                author: checkNames(firstName, lastName),
                text: newCommentText,
            };
            onAddReply(postId, parentId, newReply);
            setNewCommentText('');
            setActiveReplyBoxes(prev => ({ ...prev, [parentId]: false }));
        }
    };

    const renderComments = (comments: Comment[], parentId: string | null = null) => {
        return comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
                <Text style={styles.author}>{comment.author}</Text>
                <Text style={styles.text}>{comment.text}</Text>
                <TouchableOpacity
                    onPress={() => setActiveReplyBoxes(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                    style={styles.replyButton}
                >
                    <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
                {comment.replies && renderComments(comment.replies, comment.id)}
                {activeReplyBoxes[comment.id] && (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={newCommentText}
                            onChangeText={setNewCommentText}
                            placeholder="Write a reply..."
                            onSubmitEditing={() => handleNewReplySubmit(comment.id)}
                        />
                        <TouchableOpacity onPress={() => handleNewReplySubmit(comment.id)}>
                            <Text style={styles.postButton}>Post</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
    replyButton: {
        padding: 4,
        marginTop: 2,
    },
    replyButtonText: {
        color: '#007AFF',
    },
    reply: {
        marginTop: 5,
        padding: 8,
        backgroundColor: '#eef2ff',
        borderRadius: 4,
        marginLeft: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
});

export default Comments;