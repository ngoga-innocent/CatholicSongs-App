import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import * as MediaLibrary from "expo-media-library";
import { Alert, Platform } from "react-native";

// Request permission to access media library (Android)
export const getPermission = async () => {
  if (Platform.OS === "android") {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Permission is required to save files");
      return false;
    }
  }
  return true;
};

// Function to view PDF
export const viewPdf = async (pdfUrl) => {
  try {
    await WebBrowser.openBrowserAsync(pdfUrl);
  } catch (error) {
    console.error("Error opening PDF:", error);
    Alert.alert("Error", "Failed to open the PDF.");
  }
};

// Function to download PDF
export const downloadPdf = async (pdfUrl, name, composer, setDownloadProgress, setFileUri) => {
  console.log(pdfUrl);
  setIsDownloading(true);
  const fileName = `${name}~${composer}.pdf`;
  const fileUri = FileSystem.documentDirectory + fileName;

  try {
    const downloadResumable = FileSystem.createDownloadResumable(
      pdfUrl,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress(Math.floor(progress * 100));
      }
    );

    const { uri } = await downloadResumable.downloadAsync();
    setFileUri((prevUris) => [...prevUris, uri]);
    Alert.alert("Download complete!", "The file has been downloaded successfully.");
    setIsDownloading(false);
    // Optional: Share the downloaded PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    Alert.alert("Error", "Failed to download the PDF.");
  }
};

// Function to download and save PDF to media library
export const downloadAndSavePdf = async (pdfUrl, name, composer, setDownloadProgress, setIsDownloading) => {
  // Request storage permission
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission required", "Permission to access storage is required to save files.");
    return;
  }

  setIsDownloading(true);
  const fileName = `${name}_${composer}.pdf`; // Ensure the file has a .pdf extension
  const cacheUri = FileSystem.cacheDirectory + fileName;

  try {
    // Step 1: Download PDF to cache
    const downloadResumable = FileSystem.createDownloadResumable(
      pdfUrl,
      cacheUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress(Math.floor(progress * 100));
      }
    );

    const { uri: cachedUri } = await downloadResumable.downloadAsync();
    console.log("File downloaded to cache:", cachedUri);
    setIsDownloading(false);

    if (Platform.OS === 'android') {
      // Step 2: Request permission to access external storage using StorageAccessFramework
      const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission required', 'Permission to access external storage is required to save files.');
        return;
      }

      // Step 3: Copy the file to the selected directory
      const directoryUri = permission.directoryUri;

      try {
        // Create a new file in the selected directory
        const targetUri = await FileSystem.StorageAccessFramework.createFileAsync(
          directoryUri,
          fileName,
          "application/pdf"
        );

        // Copy content from cacheUri to targetUri
        const fileContent = await FileSystem.readAsStringAsync(
          cachedUri,
          { encoding: FileSystem.EncodingType.Base64 }
        );
        await FileSystem.writeAsStringAsync(
          targetUri,
          fileContent,
          { encoding: FileSystem.EncodingType.Base64 }
        );

        Alert.alert("Success", "The file has been saved to the selected directory.");
      } catch (error) {
        console.error("Error saving file to external storage:", error);
        Alert.alert("Error", "Could not save the file to external storage.");
      }
    } else {
      // iOS: Use the Sharing module to allow user to save or share the file
      await Sharing.shareAsync(cachedUri);
    }
  } catch (error) {
    console.error("Error downloading or saving file:", error);
    Alert.alert("Error", "Failed to save the PDF file. Please try again.");
    setIsDownloading(false);
  }
};
