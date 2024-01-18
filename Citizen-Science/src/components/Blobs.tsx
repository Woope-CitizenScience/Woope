import {Image, SafeAreaView, StyleSheet} from "react-native";
import React from "react";
import {BlobProps} from "../types";
import {responsiveHeight, responsiveWidth} from "react-native-responsive-dimensions";


const blobs = [
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
    image,
    widthPercentage,
    heightPercentage,
    position
    }) => {
    const blob = image || getRandomBlob() ;
    const rotation = rotationDeg || `${rotateBlob()}deg`;
    return(
        <SafeAreaView style={{
            justifyContent: 'center',
            position:'absolute',
            top: responsiveHeight(position.top),
            left: responsiveWidth(position.left),
            alignItems: 'center'
        }}>
            <Image
                source={blob}
                style={{
                    width: responsiveWidth(widthPercentage),
                    height: responsiveHeight(heightPercentage),
                    transform: [{rotate: rotation}]
                }}
            />
        </SafeAreaView>
    )
};

export default Blobs;
