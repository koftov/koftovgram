import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import PostList from "../components/Post/PostList";
import SmallHeader from "../components/Header/SmallHeader";
import LargeHeader from "../components/Header/LargeHeader";

const Trending = (props) => {
  return (
    <IonPage>
      <SmallHeader title="Trending" />
      <IonContent>
        <LargeHeader title="Trending" />
        <PostList location={props.location} />
      </IonContent>
    </IonPage>
  );
};

export default Trending;
