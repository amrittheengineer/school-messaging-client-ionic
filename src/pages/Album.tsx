import React, { useContext, useEffect, useState } from "react";
import {
  IonPage,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonContent,
  IonRouterLink,
  IonRouterOutlet,
  IonSlide,
  IonSlides,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

// import { NativePageTransitions } from "@ionic-native/native-page-transitions";
import { RouteComponentProps, Route, Redirect } from "react-router";
import { GalleryContext } from "../context/GalleryContext";
import { Plugins } from "@capacitor/core";
import FlatList from "flatlist-react";

const Application = Plugins.App;

const Album: React.FC<RouteComponentProps<{ id: string }>> = ({
  match,
  history,
}) => {
  const context = useContext(GalleryContext);

  const [selected, setSelected] = useState<string>("photos");

  useEffect(() => {
    Application.removeAllListeners();

    // setTimeout(() => {
    //   setsel("videos");
    // }, 5000);

    console.log(match.params.id);

    return () => {
      Application.addListener("backButton", () => {
        Application.exitApp();
      });
    };
  }, []);

  const slideOpts = {
    speed: 400,
    initialSlide: 0,
  };

  return (
    <IonPage>
      <IonToolbar>
        <IonSegment
          onIonChange={(e) => {
            // history.createHref("/view/videos")
            // setPhotoMode(false);
            setSelected(e.detail.value!);
          }}
          value={selected}
        >
          <IonSegmentButton value="photos">
            {/* <IonRouterLink routerDirection="none" routerLink="/view/photos"> */}
            Photos
            {/* </IonRouterLink> */}
          </IonSegmentButton>
          <IonSegmentButton value="videos">
            {/* <IonRouterLink routerDirection="none" routerLink="/view/videos"> */}
            Videos
            {/* </IonRouterLink> */}
          </IonSegmentButton>
        </IonSegment>
      </IonToolbar>
      <IonContent>
        {/* <IonReactRouter>
        <Route path="/view/photos" component={Photos} exact={true} />
        <Route path="/view/videos" component={Videos} exact={true} />
        <Route
          path="/album/:id"
          render={() => <Redirect to="/view/photos" />}
          exact={true}
        />
      </IonReactRouter> */}
        {selected === "photos" ? (
          <IonContent>
            <FlatList
              list={context ? context.albumPhotos : []}
              renderItem={(url, ind) => {
                return <img src={url} key={`${ind}`} />;
              }}
              renderWhenEmpty={() => <p>Nothing Here</p>}
              hasMoreItems={true}
              loadMoreItems={() => {
                console.log("Called API");

                context?.loadFromStorage(match.params.id);
              }}
            />
          </IonContent>
        ) : (
          <Videos />
        )}
      </IonContent>
    </IonPage>
  );
};

const Photos: React.FC = (props) => {
  const context = useContext(GalleryContext);

  return (
    <IonContent>
      <FlatList
        list={context ? context.albumPhotos : []}
        renderItem={(url, ind) => {
          return <img src={url} key={`${ind}`} />;
        }}
        renderWhenEmpty={() => <p>Nothing Here</p>}
        hasMoreItems={true}
        loadMoreItems={() => {
          context?.loadFromStorage("");
        }}
      />
      {/* <div style={{ backgroundColor: "#c1c1c1" }}>
        {context?.albumPhotos.map((d, ind) => (
          <img src={d} key={`${ind}`} />
        ))}
      </div> */}
    </IonContent>
  );
};
const Videos: React.FC = (props) => {
  const context = useContext(GalleryContext);

  return (
    <IonContent>
      <div style={{ backgroundColor: "#c1c1c1" }}>
        {context?.albumVideos.map((d, ind) => (
          <div key={`${ind}`}>{d}</div>
        ))}
      </div>
    </IonContent>
  );
};

export default Album;
