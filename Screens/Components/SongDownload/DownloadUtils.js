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
export const downloadPdf = async (pdfUrl, name, composer, setDownloadProgress, setFileUri, setIsDownloading) => {
  try {
    console.log("Original PDF URL:", pdfUrl);

    // Encode the URL to handle special characters
    const encodedUrl = encodeURI(pdfUrl);
    console.log("Encoded PDF URL:", encodedUrl);

    setDownloadProgress(0); // Reset progress
    setIsDownloading(true);

    const fileName = `${name}~${composer}.pdf`;
    const fileUri = FileSystem.documentDirectory + fileName;

    // Download the file using expo-file-system
    const downloadResumable = FileSystem.createDownloadResumable(
      encodedUrl,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress(Math.floor(progress * 100));
      }
    );

    const { uri } = await downloadResumable.downloadAsync();

    console.log("Downloaded file URI:", uri);
    setFileUri((prevUris = []) => [...prevUris, uri]);

    // Alert.alert("Download Complete", "The file has been downloaded successfully.");
    setIsDownloading(false);

    // Share the file (optional)
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
  } catch (error) {
    console.error("Error downloading file:", error);
    Alert.alert("Error", "Failed to download the PDF.");
    setIsDownloading(false);
  }
};

// Function to download and save PDF to media library
export const downloadAndSavePdf = async (pdfUrl, name, composer, setDownloadProgress, setIsDownloading) => {
  console.log("download",pdfUrl)
  if (!pdfUrl || typeof pdfUrl !== "string") {
    Alert.alert("Invalid URL", "The provided URL is not a valid PDF.");
    return;
  }

  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== "granted") {
    Alert.alert(
      "Permission Required",
      "Storage permission is needed to save files. Please enable it in your app settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]
    );
    return;
  }

  const fileName = `${name}_${composer}.pdf`;
  const cacheUri = FileSystem.cacheDirectory + fileName;

  try {
    setIsDownloading(true);

    // Download file
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

    if (Platform.OS === "android") {
      const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission Denied", "File saved to app storage.");
        return;
      }

      const directoryUri = permission.directoryUri;
      const targetUri = await FileSystem.StorageAccessFramework.createFileAsync(directoryUri, fileName, "application/pdf");
      const fileContent = await FileSystem.readAsStringAsync(cachedUri, { encoding: FileSystem.EncodingType.Base64 });
      await FileSystem.writeAsStringAsync(targetUri, fileContent, { encoding: FileSystem.EncodingType.Base64 });

      Alert.alert("Success", "The file has been saved.");
    } else {
      await Sharing.shareAsync(cachedUri);
      await FileSystem.deleteAsync(cachedUri, { idempotent: true });
    }
  } catch (error) {
    console.error("Error:", error);
    Alert.alert("Error", "Failed to save the file.");
    setIsDownloading(false);
  }
};
