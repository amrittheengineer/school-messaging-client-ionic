import React, { useEffect, useContext } from "react";
import { IonPage } from "@ionic/react";
import { RouteComponentProps, useHistory } from "react-router";
import { GalleryContext } from "../context/GalleryContext";

const Album: React.FC<RouteComponentProps<{ album_id: string }>> = (props: {
  match: { params: { album_id: string } };
}) => {
  const Gallery = useContext(GalleryContext);
  // useEffect(() => {
  //     Gallery
  // }, [])
  //   const album_id = props.match.params.album_id;
  //   console.log(album_id);

  return (
    <IonPage>
      <div>
        <p>Hello</p>
      </div>
    </IonPage>
  );
};

export default Album;
