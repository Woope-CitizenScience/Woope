/*
    This screen displays the information and files of the selected resource 
*/
import React, {useEffect, useState}from "react";
import { Text,View, SafeAreaView, ScrollView,StyleSheet, Image ,StatusBar, TouchableOpacity, Button, FlatList, TextInput, Modal} from "react-native";
import ResourceCard from "../../components/ResourceCard";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from "expo-sharing";
import { ResourceMedia } from "../../api/types";
import { getResourceMedia, insertResourceMedia, deleteResourceMedia} from "../../api/resources";
import { AntDesign } from '@expo/vector-icons';
import { submitForm } from "../../api/upload"
import { WebView } from "react-native-webview"
import { serverDelete } from "../../api/upload";

const API_BASE = process.env.EXPO_PUBLIC_API_URL;

interface ResourceInfo{
    name: string;
    uri: string;
}
interface FileName{
    name: string;
}


export const ResourceProfile = ({route}) => {
    const [selectedDocuments, setSelectedDocuments] = useState<ResourceInfo>({
        name: "",
        uri: "", 
    });
    const [fileName, setFileName] = useState<FileName>({
        name: "",
    });
    const [deleteCheck, setDeleteCheck] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [resourceMedia, setResourceMedia] = useState<ResourceMedia[]>();
    const [isModalVisible, setIsModalVisible] =useState<boolean>(false);
    const [isWebModalVisible, setIsWebModalVisible] =useState<boolean>(false);
    const [downloadInfo, setDownloadInfo] = useState<string>("");
    const [previewLink, setPreviewLink] = useState<string>("");
    const [previewName, setPreviewName] = useState<string>("");
    
    useEffect(() => {
        getResources();
    },[isModalVisible, deleteCheck])

    const handleInputChange = (field: keyof FileName, value: string) => {
		setFileName(prevState => ({ ...prevState, [field]: value }));
	};

// retrieves resources given parent resource_id
    const getResources = async() => {
        try {
            const response = await getResourceMedia(route.params.resource_id);
            setResourceMedia(response);
        } catch (error) {
            console.log("Failed ot retrieve resources: " + error)
        }
        
    }

// uploading selected file to server
    const uploadFile = async () => {
        const formData = new FormData();
        formData.append("file", selectedDocuments as any, selectedDocuments.name.toString());
        console.log(formData);
        submitForm("file", formData, (msg) => console.log(msg)); 
        try {
            let result = await insertResourceMedia(route.params.resource_id, fileName.name, selectedDocuments.name.toString())
        } catch (error) {
            console.log("File upload failed: " + error);
        }
    }
// uploading selected file path and info to database
    const uploadPath = async () => {
        try {
            let result = await insertResourceMedia(route.params.resource_id, fileName.name , selectedDocuments.name)
        } catch (error) {
            console.log("Error uploading filepath to database: " + error)
        }
    }
// prompts os document picker and grabs selected metadata
    const pickDocuments = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync();
                if (!result.canceled) {
                    const file = result.assets[0];
                    selectedDocuments.name = Date.now() + '--' + file.name;
                    selectedDocuments.uri = file.uri;
                }else {
                console.log("Document selection cancelled.");
                }
        } catch (error) {
            console.log("Error picking documents: " + error);
        }
    }; 
// deletes specified resource media
    const deleteMedia = async(media_id: number) => {
        try {
            let result = await deleteResourceMedia(media_id); 
        } catch (error) {
            console.log("Error deleting media: " + error);
        }
    }
// deletes from server
    const trueDelete = async(path: string) => {
        try {
            serverDelete(path);
        } catch (error) {
            console.log("Error deleting from server from frontend: " + error)
        }
    }
    const uploadPress = () => {
        pickDocuments().then((value) => {
            setIsModalVisible(true);
        });
    }
    const save = () => {
        uploadFile().then((value) => {
            setIsModalVisible(false);
        })
    }
    const pressDelete = (media_id: number, file_path: string) => {
        deleteMedia(media_id);
        console.log("ppop")
        trueDelete(file_path);
        console.log("pee")
        setDeleteCheck(!deleteCheck);
    }
    const pressDownload = (file_path: string) => {
        downloadFromUrl(file_path).then((value) => {
        })
    }
    const pressPreview = (file_path: string, name: string) => {
        setPreviewLink(file_path);
        setPreviewName(name);
        setIsWebModalVisible(true);
    }

    const downloadFromUrl = async (file_path: string) => {
        try {
            const url = API_BASE + "/uploads/" + file_path;
            const result = await FileSystem.downloadAsync(
            url,
            FileSystem.cacheDirectory + file_path
            )
            saveFile(result.uri)
        } catch (error) {
            console.log("Error downloading file: " + error);
        }
    }

    const saveFile = (url: string) => {
        Sharing.shareAsync(url)
    }
    return(
        <SafeAreaView style = {styles.container}>
                {/* Resource Card */}
                <ResourceCard resource_id={route.params.resource_id} org_id={route.params.org_id}/>
                {/* Resources Container */}
                <Button title="Upload Files" onPress={() => { uploadPress() }}/>
                    {/* Divider */}
                    {/* !TODO: implement severside deletion logic */}
                <FlatList 
                    style={styles.flatlist}
                    data={resourceMedia}
                    numColumns={1}
                    keyExtractor={item => item.media_id}
                    renderItem={({item}) => 
                    (
                        <View style={styles.mediarow}>
                            <View style={styles.postBox}>
                                <View style={styles.postBoxInner}>
                                    <Text style={styles.postBoxText}>{item.name}</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => {
                                pressDownload(item.file_path);
                            }}>
                                <AntDesign name="download" size={30}/>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => {
                                pressPreview(item.file_path, item.name);
                            }}>
                                <AntDesign name="eyeo" size={30}/>
                            </TouchableOpacity> 

                            <TouchableOpacity onPress={() => {
                                pressDelete(item.media_id, item.file_path);
                            }}>
                                <AntDesign color={"red"} name="close" size={30}/>
                            </TouchableOpacity>
                        </View>
                    )
                    }/>

                    {/* Webview Modal */}
                    <Modal visible={isWebModalVisible} animationType='slide' transparent={true}>
                        <View style={styles.webContainer}>
                            <View style={styles.webBar}>
                                <Text style={styles.preview}>{previewName} Preview</Text>

                                <TouchableOpacity onPress={()=> setIsWebModalVisible(false)}>
                                    <Text style={styles.close}>Close</Text>
                                </TouchableOpacity>
                                
                            </View>
                            <View style = {styles.webContent}>
                                <WebView source={{ uri: API_BASE + "/uploads/" + previewLink }} ></WebView>
                            </View>
                        </View>
                    </Modal>
                
                    {/* Enter name of file modal */}
                    <Modal visible={isModalVisible} animationType="fade" transparent={true}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modal}>
                                <Text>Enter Name Of File</Text>
                                <TextInput onChangeText={(value) => handleInputChange("name", value)}
                                    maxLength={20}
                                    multiline={false}
                                    scrollEnabled={false}
                                    style = {styles.textbox}></TextInput>
                                <View style={styles.confirm}> 
                                    <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                        <Text style = {styles.cancel}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => save()}>
                                        <Text style = {styles.upload}>Upload</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "white",
        
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        
    },
    webBar: {
        paddingTop: 20,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "white",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 1,
    },
    webModal: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
    },
    webContent: {
        flex: 20,
        padding: 10,
        borderRadius: 10,
        
    },
    webContainer: {
        flex: 1,
        backgroundColor: "white",
        marginTop: 20,
        padding: 20,
    },
    title: {
        fontSize: 15,
        color: '#232f46',
    },
    directoryButton: {
        flex: 1,
        borderRadius: 10,
        padding: 14,
        marginVertical: 7,
        backgroundColor: "lightblue",
        alignItems: "center",
        justifyContent: "center",
        shadowOffset: {
            width: 1,
            height: 1,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 9,
    },
    upcomingEvents: {
        alignItems: 'center', 
        marginHorizontal:20,
        marginBottom: 5,
        padding: 10,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
    }, 
    flatlist: {
        flex: 1
    },
    mediarow: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        gap: 10,
        marginHorizontal: 15,
    },
    textbox:{
        borderRadius: 5,
        borderWidth: 2,
        flexDirection: "row",
        borderColor: "lightblue",
        backgroundColor: "white"
    },
    modal: {
        backgroundColor: "white",
        opacity: 1,
        flexDirection: "column",
        alignSelf: "center",
        justifyContent: "center",
        gap: 10,
        padding: 30,
        borderRadius: 10,
    }, 
    confirm: {
        flexDirection: "row",
        alignContent: "space-between",
        gap: 30,
    },
    cancel: {
        fontSize: 20,
        color: "red"
    }, 
    upload: {
        fontSize: 20,
        color: "blue"
    },
    close: {
        fontSize: 20,
        color: "red",
    },
    preview: {
        fontSize: 20,
        color: "grey"
    },
    postBox: {
        flex: 1,
        backgroundColor: "#B4D7EE",
        borderRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
        marginHorizontal: 10,
        marginBottom: 10,
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
      }
});
export default ResourceProfile;
