/*
    This screen displays the information and files of the selected resource 
*/
import React, {useEffect, useState}from "react";
import { Text,View, SafeAreaView,ScrollView,StyleSheet,Image,StatusBar, TouchableOpacity, Button, FlatList} from "react-native";
import ResourceCard from "../../components/ResourceCard";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from "expo-sharing";
import { ResourceMedia } from "../../api/types";
import { getResourceMedia, insertResourceMedia, deleteResourceMedia} from "../../api/resources";
import { MaterialIcons, Octicons, AntDesign } from '@expo/vector-icons';
import { submitForm } from "../../api/upload";

export const ResourceProfile = ({route}) => {
    const [selectedDocuments, setSelectedDocuments] = useState<DocumentPicker.DocumentPickerResult>();
    const [uriRetrieved, setUriRetrieved] = useState("");
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [download, setDownload] = useState();
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const filename: string = route.params.resource_id;
    const [resourceMedia, setResourceMedia] = useState<ResourceMedia[]>();
    let docPath : string = route.params.resource_id.toString();
    
    useEffect(() => {
        const downloadResumable = FileSystem.createDownloadResumable(
            "https://file-examples.com/storage/fe602ed48f677b2319947f8/2018/04/file_example_MOV_1920_2_2MB.mov",
            FileSystem.documentDirectory+filename,
            {},
            (progress) => {
                const percentProgress = (progress.totalBytesWritten / progress.totalBytesExpectedToWrite * 100).toFixed(2);
                setDownloadProgress(percentProgress);
            });
        setDownload(downloadResumable);
    },[selectedDocuments])

    //retrieves resource children given parent resource_id
    useEffect(() => {
        getResources();
    })

    const getResources = async() => {
        const response = await getResourceMedia(route.params.resource_id);
        setResourceMedia(response);
    }
    const downloadFile = async() => {
        setIsDownloading(true);
        const {uri} = await download.downloadAsync();
        console.log(uri);
        
        setIsDownloading(false);
    };
    const insertMedia = async(resource_id: number, name: string, uid: string) => {
        try {
            await insertResourceMedia(resource_id, name, uid);
        } catch (error) {
            console.log("Error uploading media " + error);
        }
    }
    const save = (uri) => {
        shareAsync(uri);
    };
    
    const pickDocuments = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync();
            if (!result.canceled) {
                setSelectedDocuments(result);
                const formData = new FormData();
                const assets = result.assets;
                const file = assets[0];
                const selectedFile = {
                    name: file.name,
                    uri: file.uri,
                    type: file.mimeType,
                    size: file.size
                };
                console.log(selectedFile);
                formData.append("file", selectedFile as any, selectedFile.name);
                submitForm("file", formData, (msg) => console.log(msg));
                setUriRetrieved(file.uri);
                insertMedia(route.params.resource_id, selectedFile.name, selectedFile.uri);
                downloadFile();
            }else {
            console.log("Document selection cancelled.");
            }
            } catch (error) {
                console.log("Error picking documents:", error);
            }
        }; 
    return(
        <SafeAreaView style = {styles.container}>
                {/* Resource Card */}
                <ResourceCard resource_id={route.params.resource_id} org_id={route.params.org_id}/>
                {/* Resources Container */}
                <Button title="Upload Files" onPress={() => {pickDocuments()}}/>
                <View>
                    {isDownloading && <Text>Uploading: {downloadProgress}%</Text>}
                </View>
                    {/* Divider */}
                <FlatList 
                    style={styles.flatlist}
                    data={resourceMedia}
                    numColumns={1}
                    keyExtractor={item => item.media_id}
                    renderItem={({item}) => 
                    (
                        <View style={styles.mediarow}>
                            <View style={styles.directoryButton} >
                                <Text style={styles.title}>{item.name}</Text>
                            </View>
                            <TouchableOpacity>
                                <AntDesign name="download" size={30}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                deleteResourceMedia(item.media_id)
                            }}>
                                <AntDesign color={"red"} name="close" size={30}/>
                            </TouchableOpacity>
                            
                        </View>
                    )
                    }/>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: "white",
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
    }
});
export default ResourceProfile;
