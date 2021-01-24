import React from "react";
import { View, Text } from "react-native";

export default class Chat extends React.Component {
  render() {
    const { name, color } = this.props.route.params;

    // props user's Name
    this.props.navigation.setOptions({ title: name });

    return <View style={{ flex: 1, backgroundColor: color }}></View>;
  }
}
