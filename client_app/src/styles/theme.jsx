import { Dimensions } from "react-native"

const COLORS = {
    cardItem: '#18191a',
    title: 'white',
    subTitle: 'grey',
    icon: 'white',
    iconPower: 'red',
    circleOnl: 'greed',
    background: 'black'
}

const SIZES = {
    background: Dimensions.get("window").width / 30,
    title: Dimensions.get("window").width / 17,
    titleCard: 22,
    subTitleCard: Dimensions.get("window").width / 26,
    border: 8,
}

export {COLORS, SIZES}