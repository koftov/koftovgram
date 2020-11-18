import firebase from "../firebase";

function addLike(user, postId) {
  if (!user) return Promise.reject();

  const postRef = firebase.db.collection("posts").doc(postId);

  return postRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      const previousLikes = data.likes;
      const like = { likedBy: { id: user.uid, name: user.displayName } };
      const updatedLikes = [...previousLikes, like];
      const likeCount = updatedLikes.length;
      postRef.update({ likes: updatedLikes, likeCount });

      return {
        ...data,
        likes: updatedLikes,
        likeCount: likeCount,
      };
    }
  });
}

export default {
  addLike,
};
