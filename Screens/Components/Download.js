import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const DownloadPDF = ({pdfUrl}) => {
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [fileUri, setFileUri] = useState('');

  // URL of the PDF to download
 

  // Function to download the PDF
  const downloadPdf = async () => {
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        pdfUrl,
        FileSystem.documentDirectory + 'sample.pdf', // File path to save the downloaded PDF
        {},
        handleDownloadProgress
      );

      const { uri } = await downloadResumable.downloadAsync();
      setFileUri(uri);
      Alert.alert('Download complete!', 'The file has been downloaded successfully.');

      // Optional: Share the downloaded PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', 'Failed to download the PDF.');
    }
  };

  // Function to track download progress
  const handleDownloadProgress = (downloadProgress) => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress * 100);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{downloadProgress ? `Download Progress: ${Math.round(downloadProgress)}%` : 'Download a PDF'}</Text>

      <Button title="Download PDF" onPress={downloadPdf} />

      {fileUri ? <Text>File saved to: {fileUri}</Text> : null}
    </View>
  );
};

export default DownloadPDF;
