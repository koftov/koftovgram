import React from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonTitle,
  IonText,
} from "@ionic/react";
import { closeCircleOutline } from "ionicons/icons";

import firebase from "../firebase";
import postService from "../services/post";
import { Plugins } from "@capacitor/core";
import UserContext from "../contexts/UserContext";
import NavHeader from "../components/Header/NavHeader";
import PostItem from "../components/Post/PostItem";
import PostPhotos from "../components/Post/PostPhotos";
import PostComment from "../components/Post/PostComment";
import CommentModal from "../components/Post/CommentModal";

const { Browser } = Plugins;

const Post = (props) => {
  const { user } = React.useContext(UserContext);
  const [post, setPost] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const postId = props.match.params.postId;
  const postRef = firebase.db.collection("posts").doc(postId);

  React.useEffect(() => {
    getPost();
    // eslint-disable-next-line
  }, [postId]);

  function getPost() {
    postRef.get().then((doc) => {
      setPost({ ...doc.data(), id: doc.id });
    });
  }

  function handleOpenModal() {
    if (!user) {
      props.history.push("/login");
    } else {
      setShowModal(true);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  function handleAddComment(commentText) {
    if (!user) {
      props.history.push("/login");
    } else {
      postRef.get().then((doc) => {
        if (doc.exists) {
          const previousComments = doc.data().comments;
          const newComment = {
            postedBy: { id: user.uid, name: user.displayName },
            created: Date.now(),
            text: commentText,
          };
          const updatedComments = [...previousComments, newComment];
          postRef.update({ comments: updatedComments });
          setPost((prevState) => ({
            ...prevState,
            comments: updatedComments,
          }));
        }
      });
      setShowModal(false);
    }
  }

  function handleAddLike() {
    if (!user) {
      props.history.push("/login");
    } else {
      postService
        .addLike(user, postId)
        .then((newPost) => setPost(newPost))
        .catch(() => props.history.push("/login"));
    }
  }

  function handleDeletePost() {
    postRef
      .delete()
      .then(() => {
        console.log(`Document with ID ${post.id} deleted`);
      })
      .catch((err) => {
        console.error("Error deleting document:", err);
      });
    props.history.push("/");
  }

  function postedByAuthUser(post) {
    return user && user.uid === post.postedBy.id;
  }

  async function openBrowser() {
    await Browser.open({
      url: post.url,
    });
  }
  console.log(post);

  return (
    <IonPage>
      <NavHeader
        title={post && post.title}
        option={post && postedByAuthUser(post)}
        icon={closeCircleOutline}
        action={handleDeletePost}
      />
      <IonContent>
        <CommentModal
          isOpen={showModal}
          title="New Comment"
          sendAction={handleAddComment}
          closeAction={handleCloseModal}
        />
        {post && (
          <>
            <IonGrid>
              <IonRow>
                <IonCol class="ion-text-center">
                  <IonImg src={post.photo} />
                  <IonTitle>
                    <b>{user.displayName}</b> {post.title}
                  </IonTitle>
                  {/* <br /> */}
                  <IonButton
                    onClick={() => handleAddLike()}
                    size="small"
                    disabled={post.vot}
                  >
                    Like
                  </IonButton>
                  <IonButton onClick={() => handleOpenModal()} size="small">
                    Comment
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
            {post.comments.map((comment, index) => (
              <PostComment
                key={index}
                comment={comment}
                post={post}
                setPost={setPost}
              />
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Post;
