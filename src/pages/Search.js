import React from "react";
import { IonContent, IonPage, IonSearchbar } from "@ionic/react";
import firebase from "../firebase";
import PostItem from "../components/Post/PostItem";
import LargeHeader from "../components/Header/LargeHeader";
import SmallHeader from "../components/Header/SmallHeader";

const Search = () => {
  const [filteredPosts, setFilteredPosts] = React.useState([]);
  const [posts, setPosts] = React.useState([]);
  const [filter, setFilter] = React.useState("");

  React.useEffect(() => {
    getInitialPosts();
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    handleSearch();
    // eslint-disable-next-line
  }, [filter]);

  function getInitialPosts() {
    firebase.db
      .collection("posts")
      .get()
      .then((snapshot) => {
        const posts = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setPosts(posts);
        console.log(posts);
      });
  }

  function handleChange(evt) {
    if (evt.key === "Enter") {
      setFilter(evt.target.value);
    }
  }

  function handleSearch() {
    const query = filter.toLowerCase();
    const matchedPosts = posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(query) ||
        post.postedBy.name.toLowerCase().includes(query)
      );
    });
    setFilteredPosts(matchedPosts);
  }

  return (
    <IonPage>
      <SmallHeader title="Search" />
      <IonContent>
        <LargeHeader title="Search" />
        <IonSearchbar
          placeholder="Search"
          spellcheck="false"
          type="url"
          value={filter}
          onKeyPress={handleChange}
          animated
        />
        {filteredPosts.map((filteredPost, index) => (
          <PostItem
            key={filteredPost.id}
            showCount={false}
            post={filteredPost}
            index={index}
            url={`/post/${filteredPost.id}`}
          />
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Search;
