import React from "react";
import { View, Text, Platform, KeyboardAvoidingView } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();

    // configuration to connect to firebase
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDvHVsss6dVnciK2rYXph1V6TXkecMX-Dk",
        authDomain: "chatty-82b03.firebaseapp.com",
        projectId: "chatty-82b03",
        storageBucket: "chatty-82b03.appspot.com",
        messagingSenderId: "339018453784",
        appId: "1:339018453784:web:43d95515d57d64b7bb046d",
        measurementId: "G-GNL2RX6Q4P",
      });
    }

    // Retrive msg
    this.referenceMessages = firebase.firestore().collection("messages");

    this.state = {
      message: [],
      user: {},
      uid: 0,
    };
  }

  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        user = await firebase.auth().signInAnonymously();
      }
      // Update user
      this.setState({
        uid: user.uid,
        messages: [
          {
            _id: 1,
            text: this.props.route.params.name + " has entered the chat.",
            createdAt: new Date(),
            system: true,
          },
        ],
      });

      // new msg
      this.unsubscribe = this.referenceMessages.onSnapshot(
        this.onCollectionUpdate
      );
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Map throug documents
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  // store sent messages
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  // add new message to database
  addMessage() {
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text,
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      uid: this.state.uid,
    });
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
    const { messages, uid } = this.state;
    // props user's Name
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        {/* actual chat */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: uid,
            name: name,
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
