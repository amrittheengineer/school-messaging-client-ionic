import React, { useState, useEffect, Provider } from "react";
import request from "../modules/request";
import axios, { Canceler, CancelToken } from "axios";

interface Album {
  videos: number;
  date: number;
  id: string;
  thumbnail: string;
  title: string;
}

interface GalleryContextInterface {
  currentAlbum: Album | null;
  setCurrentAlbum: (photos: Album | null) => void;
  albumPhotos: Array<string>;
  setAlbumPhotos: (photos: Array<string>) => void;
  albumVideos: Array<string>;
  setalbumVideos: (photos: Array<string>) => void;
  //       albumPhotos,
  //       setAlbumPhotos,
  //       albumVideos,
  //       setalbumVideos,
}

const GalleryContext = React.createContext<GalleryContextInterface | null>(
  null
);
export const GalleryContextProvider = (props: {
  children: React.ReactChildren;
}) => {
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);

  const [albumPhotos, setAlbumPhotos] = useState<Array<string>>([]);
  const [albumVideos, setalbumVideos] = useState<Array<string>>([]);
  useEffect(() => {
    let cancel: Canceler;
    if (currentAlbum !== null) {
      console.log("Changed album state");
      setAlbumPhotos([]);
      let source: CancelToken = new axios.CancelToken((c) => {
        cancel = c;
      });
      const { requestPromise } = request(
        "/api/student/get-photos/" + currentAlbum.id + "/1",
        { method: "GET", cancelToken: source }
      );

      requestPromise
        .then((res: { data: { photos: Array<string> } }) => {
          const { photos } = res.data;
          setAlbumPhotos([...photos]);
        })
        .catch((err) => console.log(err));
    }
    return () => {
      if (cancel) cancel();
    };
  }, [currentAlbum!.id]);

  useEffect(() => {
    let cancel: Canceler;
    if (currentAlbum !== null) {
      setalbumVideos([]);
      let source: CancelToken = new axios.CancelToken((c) => {
        cancel = c;
      });
      const { requestPromise } = request(
        "/api/student/get-videos/" + currentAlbum.id + "/1",
        { method: "GET", cancelToken: source }
      );
      requestPromise.then((res: { data: { videos: Array<string> } }) => {
        const { videos } = res.data;
        setalbumVideos([...videos]);
      });
    }
    return () => {
      if (cancel) cancel();
    };
  }, [currentAlbum!.id]);

  return (
    <GalleryContext.Provider
      value={{
        currentAlbum,
        setCurrentAlbum,
        albumPhotos,
        setAlbumPhotos,
        albumVideos,
        setalbumVideos,
      }}
    >
      {props.children}
    </GalleryContext.Provider>
  );
};
