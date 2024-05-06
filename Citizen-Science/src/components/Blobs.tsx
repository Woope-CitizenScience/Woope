import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView } from "react-native";
import { BlobProps } from "../types";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";

const blobs = [
    require('../../assets/blobs/Blob_4.png'),
    require('../../assets/blobs/Blob_5.png'),
    require('../../assets/blobs/Blob_6.png'),
    require('../../assets/blobs/Blob_7.png'),
    require('../../assets/blobs/Blob_8.png'),
    require('../../assets/blobs/Blob_9.png'),
    require('../../assets/blobs/Blob_10.png'),
];

const Blobs: React.FC<BlobProps> = ({
                                        image,
                                        widthPercentage,
                                        heightPercentage,
                                        position,
                                    }) => {
    // State to hold the selected blob image
    const [selectedBlob, setSelectedBlob] = useState(image || getRandomBlob());

    useEffect(() => {
        // If an image is provided via props, use it; otherwise, select a random blob
        if (!image) {
            setSelectedBlob(getRandomBlob());
        }
    }, [image]); // This dependency ensures the effect runs only when the image prop changes

    return (
        <SafeAreaView style={{
            justifyContent: 'center',
            position: 'absolute',
            top: responsiveHeight(position.top),
            left: responsiveWidth(position.left),
            alignItems: 'center',
        }}>
            <Image
                source={selectedBlob}
                style={{
                    width: responsiveWidth(widthPercentage),
                    height: responsiveHeight(heightPercentage),
                    // Removed rotation styling
                }}
            />
        </SafeAreaView>
    );
};

export default Blobs;

// Helper function to get a random blob
const getRandomBlob = () => {
    const randomIndex = Math.floor(Math.random() * blobs.length);
    return blobs[randomIndex];
};