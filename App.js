import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, ScrollView } from "react-native";

export default function App() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Pogoy Jordan",
      text: "Happy Birthday Self :)",
      likes: 0,
      isLiked: false,
      comments: [],
      showCBox: false,
    },
  ]);

  const upd = (id, fn) => setPosts(ps => ps.map(p => (p.id === id ? fn(p) : p)));
  const like = o => ({
    ...o,
    likes: o.isLiked ? o.likes - 1 : o.likes + 1,
    isLiked: !o.isLiked,
  });

  const addC = (id, t) =>
    t.trim() &&
    upd(id, p => ({
      ...p,
      comments: [
        ...p.comments,
        {
          id: Date.now(),
          text: t,
          likes: 0,
          isLiked: false,
          replies: [],
          showRBox: false,
        },
      ],
    }));

  return (
    <ScrollView style={s.page}>
      {posts.map(p => (
        <View key={p.id} style={s.post}>
          <View style={s.profile}>
            <Image
              source={{ uri: "https://via.placeholder.com/40" }}
              style={s.avatar}
            />
            <Text style={{ fontWeight: "bold" }}>{p.author}</Text>
          </View>

          <Text>{p.text}</Text>

          <View style={s.actions}>
            <Btn onPress={() => upd(p.id, x => like(x))}>
              👍 {p.isLiked ? "Unlike" : "Like"} ({p.likes})
            </Btn>
            <Btn onPress={() => upd(p.id, x => ({ ...x, showCBox: !x.showCBox }))}>
              💬 Comment
            </Btn>
            <Btn onPress={() => alert("Successfully share the post!")}>↗️ Share</Btn>
          </View>

          {p.showCBox && <CBox onS={t => addC(p.id, t)} />}

          {p.comments.map(c => (
            <Com
              key={c.id}
              c={c}
              onLike={() =>
                upd(p.id, x => ({
                  ...x,
                  comments: x.comments.map(y => (y.id === c.id ? like(y) : y)),
                }))
              }
              onRep={t =>
                upd(p.id, x => ({
                  ...x,
                  comments: x.comments.map(y =>
                    y.id === c.id
                      ? {
                          ...y,
                          replies: [...y.replies, { id: Date.now(), text: t }],
                          showRBox: false,
                        }
                      : y
                  ),
                }))
              }
              tog={() =>
                upd(p.id, x => ({
                  ...x,
                  comments: x.comments.map(y =>
                    y.id === c.id ? { ...y, showRBox: !y.showRBox } : y
                  ),
                }))
              }
            />
          ))}
        </View>
      ))}

      {/* Messenger Chat */}
      <MessengerChat />
    </ScrollView>
  );
}

const Btn = ({ children, onPress }) => (
  <TouchableOpacity style={s.btn} onPress={onPress}>
    <Text style={{ color: "white" }}>{children}</Text>
  </TouchableOpacity>
);

const CBox = ({ onS }) => {
  const [t, setT] = useState("");
  return (
    <View style={s.commentBox}>
      <TextInput
        value={t}
        onChangeText={setT}
        placeholder="Write a comment..."
        style={s.input}
      />
      <Btn
        onPress={() => {
          onS(t);
          setT("");
        }}
      >
        Post
      </Btn>
    </View>
  );
};

const Com = ({ c, onLike, onRep, tog }) => {
  const [r, setR] = useState("");
  return (
    <View style={s.comment}>
      <Text>{c.text}</Text>
      <View style={s.commentActions}>
        <TouchableOpacity onPress={onLike}>
          <Text style={s.smallAction}>
            👍 {c.isLiked ? "Unlike" : "Like"} ({c.likes})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={tog}>
          <Text style={s.smallAction}>↩️ Reply</Text>
        </TouchableOpacity>
      </View>

      {c.showRBox && (
        <View style={{ flexDirection: "row", gap: 6, marginTop: 6 }}>
          <TextInput
            value={r}
            onChangeText={setR}
            placeholder="Write a reply..."
            style={{ flex: 1, padding: 6, borderWidth: 1, borderRadius: 6 }}
          />
          <TouchableOpacity
            onPress={() => {
              onRep(r);
              setR("");
            }}
            style={s.replyBtn}
          >
            <Text style={{ color: "white" }}>Reply</Text>
          </TouchableOpacity>
        </View>
      )}

      {c.replies.map(rr => (
        <View key={rr.id} style={s.reply}>
          <Text>{rr.text}</Text>
        </View>
      ))}
    </View>
  );
};

const MessengerChat = () => {
  const [msgs, setMsgs] = useState([{ id: 1, text: "Hi Brother😊", fromMe: false }]);
  const [t, setT] = useState("");

  const send = () => {
    if (!t.trim()) return;
    setMsgs([...msgs, { id: Date.now(), text: t, fromMe: true }]);
    setT("");
  };

  return (
    <View style={s.chatBox}>
      <FlatList
        data={msgs}
        keyExtractor={m => m.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              s.chatBubble,
              {
                alignSelf: item.fromMe ? "flex-end" : "flex-start",
                backgroundColor: item.fromMe ? "#007bff" : "#e5e5ea",
              },
            ]}
          >
            <Text style={{ color: item.fromMe ? "white" : "black" }}>{item.text}</Text>
          </View>
        )}
      />

      <View style={s.chatInputArea}>
        <TextInput
          value={t}
          onChangeText={setT}
          placeholder="Type a message..."
          style={s.chatInput}
        />
        <TouchableOpacity onPress={send} style={s.chatSendBtn}>
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "white", padding: 10 },
  post: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  profile: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  actions: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  btn: {
    backgroundColor: "black",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  commentBox: { flexDirection: "row", gap: 8, marginTop: 10 },
  input: { flex: 1, borderWidth: 1, borderRadius: 6, padding: 6 },
  comment: { marginBottom: 10 },
  commentActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  smallAction: { color: "white", fontSize: 13, marginRight: 10 },
  reply: {
    backgroundColor: "gray",
    padding: 6,
    borderRadius: 12,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  replyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "black",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  chatBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginTop: 20,
    height: 300,
    overflow: "hidden",
  },
  chatBubble: { padding: 10, borderRadius: 16, marginVertical: 4, maxWidth: "70%" },
  chatInputArea: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  chatInput: { flex: 1, borderWidth: 1, borderRadius: 16, padding: 8 },
  chatSendBtn: {
    marginLeft: 8,
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    borderRadius: 16,
    justifyContent: "center",
  },
});
