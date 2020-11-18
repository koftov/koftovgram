import React from "react";
import firebase from "../../firebase";
import PostItem from "./PostItem";
import formatDate from "date-fns/format";
import isYesterday from "date-fns/isYesterday";
import isToday from "date-fns/isToday";
import { IonItem, IonLabel } from "@ionic/react";

const PostList = (props) => {
  const [posts, setPosts] = React.useState([]);
  const isTrending = props.location.pathname.includes("trending");

  React.useEffect(() => {
    const unsubscribe = getPosts();
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [isTrending]);

  function getPosts() {
    if (isTrending) {
      return firebase.db
        .collection("posts")
        .orderBy("likeCount", "desc")
        .onSnapshot(handleSnapshot);
    }

    return firebase.db
      .collection("posts")
      .orderBy("created", "desc")
      .onSnapshot(handleSnapshot);
  }

  function handleSnapshot(snapshot) {
    const posts = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    setPosts(posts);
  }

  let prevDate = null;

  return posts.map((post, index) => {
    const result = [
      <PostItem
        key={post.id}
        showCount={true}
        url={`/post/${post.id}`}
        post={post}
        index={index + 1}
      />,
    ];
    const currentDate = isToday(post.created)
      ? "Today"
      : isYesterday(post.created)
      ? "Yesterday"
      : formatDate(post.created, "MMM d");

    if (currentDate !== prevDate && !isTrending) {
      result.unshift(
        <IonItem color="medium" lines="none" key={currentDate}>
          <IonLabel>
            <strong>{currentDate}</strong>
          </IonLabel>
        </IonItem>
      );

      prevDate = currentDate;
    }

    return result;
  });
};

export default PostList;
