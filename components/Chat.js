import React from "react";
import { View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      message: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello " + this.props.route.params.name + "!",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text: this.props.route.params.name + " has entered the chat.", // gretting the user entered the chat
          createdAt: new Date(),
          system: true, // this is a system message
        },
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  // customising the Bubbles
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#000",
          },
          left: {
            backgroundColor: "#fff",
          },
        }}
      />
    );
  }

  render() {
    const { name, color } = this.props.route.params;
    // props user's Name
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        {/* actual chat */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/* fixing the android keyboard */}
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
