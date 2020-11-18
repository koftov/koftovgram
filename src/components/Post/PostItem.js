import React from "react";
import { withRouter } from "react-router-dom";
import {
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
  IonCard,
  IonCardContent,
  IonThumbnail,
  IonList,
  IonImg,
  IonButton,
} from "@ionic/react";
import {
  chevronUpCircleOutline,
  chatbubbleEllipsesOutline,
  personCircleOutline,
  timeOutline,
  caretUp,
} from "ionicons/icons";
import UserContext from "../../contexts/UserContext";
import postService from "../../services/post";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import "./PostItem.css";

const PostItem = ({ post, history, url, browser }) => {
  const { user } = React.useContext(UserContext);

  const addLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    postService.addLike(user, post.id).catch(() => {
      history.push("/login");
    });
  };

  return (
    <IonCard routerLink={url} onClick={browser} button>
      <IonCardContent class="ion-no-padding">
        <IonList lines="none">
          <IonItem>
            <IonThumbnail slot="start">
              <IonImg src={post.photo} />
            </IonThumbnail>
            <IonLabel>
              <div className="ion-text-wrap">
                <strong style={{ fontSize: "1rem" }}>{post.title}</strong>
              </div>

              <div className="ion-text-wrap" style={{ fontSize: "0.8rem" }}>
                {post.description}
              </div>

              <p
                style={{
                  alignItems: "center",
                  fontSize: "0.8rem",
                  fontWeight: "normal",
                }}
              >
                <IonIcon
                  icon={chevronUpCircleOutline}
                  style={{
                    verticalAlign: "middle",
                  }}
                />{" "}
                <IonText
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  {post.likeCount} points
                </IonText>
                {" | "}
                <IonIcon
                  icon={personCircleOutline}
                  style={{
                    verticalAlign: "middle",
                  }}
                />{" "}
                <IonText
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  {post.postedBy.name}
                </IonText>
                {" | "}
                <IonIcon
                  icon={timeOutline}
                  style={{
                    verticalAlign: "middle",
                  }}
                />{" "}
                <IonText
                  style={{
                    verticalAlign: "middle",
                  }}
                >
                  {formatDistanceToNow(post.created)}
                </IonText>
                {post.comments.length > 0 && (
                  <>
                    {" | "}
                    <IonIcon
                      icon={chatbubbleEllipsesOutline}
                      style={{
                        verticalAlign: "middle",
                      }}
                    />{" "}
                    <IonText
                      style={{
                        verticalAlign: "middle",
                      }}
                    >
                      {post.comments.length} comments
                    </IonText>
                  </>
                )}{" "}
              </p>
            </IonLabel>
            <IonButton slot="end" onClick={addLike} size="large">
              <div className="like-button__inner">
                <IonIcon icon={caretUp} />
                {post.likeCount}
              </div>
            </IonButton>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default withRouter(PostItem);
