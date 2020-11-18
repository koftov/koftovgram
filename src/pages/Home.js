import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import PostList from "../components/Post/PostList";
import SmallHeader from "../components/Header/SmallHeader";
import LargeHeader from "../components/Header/LargeHeader";

const Home = (props) => {
  return (
    <IonPage>
      <SmallHeader title="Koftovgram" />
      <IonContent color="medium" fullscreen>
        <LargeHeader title="Koftovgram" />
        <br></br>
        <PostList location={props.location} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
