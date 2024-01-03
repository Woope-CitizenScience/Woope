import {Image, SafeAreaView, StyleSheet} from "react-native";
import React from "react";
import {BlobProps} from "../types";


const blobs = [
    require('../../assets/blobs/Blob_1.png'),
    require('../../assets/blobs/Blob_2.png'),
    require('../../assets/blobs/Blob_3.png'),
    require('../../assets/blobs/Blob_4.png'),
    require('../../assets/blobs/Blob_5.png'),
    require('../../assets/blobs/Blob_6.png'),
    require('../../assets/blobs/Blob_7.png'),
    require('../../assets/blobs/Blob_8.png'),
    require('../../assets/blobs/Blob_9.png'),
    require('../../assets/blobs/Blob_10.png')
];

const getRandomBlob = () => {
    const randomIndex = Math.floor(Math.random() * blobs.length);
    return blobs[randomIndex];
};

const rotateBlob = () => {
    return Math.floor(Math.random() * 37) * 10; // Degrees increment by 10 so (10, 20, 30, ... 360)
}

const Blobs: React.FC<BlobProps> = ({
    rotationDeg,
    width,
    height,
    position
    }) => {
    const blob = getRandomBlob();
    const rotation = rotationDeg || `${rotateBlob()}deg`;
    return(
        <SafeAreaView style={{
            flex: 1,
            position: 'absolute',
            left: position.horizontal,
            top: position.vertical
        }}>
            <Image
                source={blob}
                style={{
                    width: width,
                    height: height,
                    transform: [{rotate: rotation}]
                }}
            />
        </SafeAreaView>
    )
};

export default Blobs;
