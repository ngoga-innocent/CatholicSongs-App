import { Dimensions } from "react-native"
export const COLORS = {
    'Primary': '#282D3B',
    'white': "#ffffff",
    "black": "#000",
    "purple": "#c92aaf",
    "bg": "#B1BFD1",
    "green":"#64C3BE"
}
export const dimensions={
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    big_icon:Dimensions.get('window').width * 0.09
}