import React from "react";
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonRow,
  IonCol,
  IonButton,
} from "@ionic/react";
import useFormValidation from "../hooks/useFormValidation";
import validateCreatePost from "../components/Post/validateCreatePost";
import firebase from "../firebase";
import UserContext from "../contexts/UserContext";
import SmallHeader from "../components/Header/SmallHeader";
import LargeHeader from "../components/Header/LargeHeader";
import Upload from "../components/Form/Upload";
import { toast } from "../utils/toast";

const INITIAL_STATE = {
  title: "",
};

const Submit = ({ history }) => {
  const { user } = React.useContext(UserContext);
  const [submitting, setSubmitting] = React.useState(false);
  const [photo, setPhoto] = React.useState([]);
  const { handleSubmit, handleChange, values } = useFormValidation(
    INITIAL_STATE,
    validateCreatePost,
    handleCreate
  );

  async function handleCreate() {
    try {
      if (!user) {
        history.push("/login");
        return;
      }

      setSubmitting(true);

      const { title } = values;
      const id = firebase.db.collection("posts").doc().id;

      await Promise.all([
        ...photo.map((f, index) =>
          firebase.storage.ref().child(`products/${id}.jpg`).put(f)
        ),
      ]);

      const postPhoto = await Promise.all(
        photo.map((f, index) =>
          firebase.storage.ref().child(`products/${id}.jpg`).getDownloadURL()
        )
      );

      const newPost = {
        title,
        postedBy: {
          id: user.uid,
          name: user.displayName,
        },
        photo: postPhoto,
        likeCount: 1,
        comments: [],
        likes: [
          {
            likedBy: { id: user.uid, name: user.displayName },
          },
        ],
        created: Date.now(),
      };
      setPhoto(null);
      await firebase.db.collection("posts").doc(id).set(newPost);
      history.push("/");
    } catch (e) {
      console.error(e);
      toast(e.message);
      setSubmitting(false);
    }
  }

  return (
    <IonPage>
      <SmallHeader title="Submit" />
      <IonContent>
        <LargeHeader title="Submit" />
        <IonItem lines="full">
          <IonLabel position="floating">Title</IonLabel>
          <IonInput
            name="title"
            value={values.title}
            type="text"
            onIonChange={handleChange}
            required
          ></IonInput>
        </IonItem>
        <IonRow></IonRow>
        <IonRow>
          <IonCol>
            <Upload
              files={photo}
              onChange={setPhoto}
              placeholder="Select Post Photo"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton
              type="submit"
              color="primary"
              expand="block"
              disabled={submitting}
              onClick={handleSubmit}
            >
              Submit
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Submit;
