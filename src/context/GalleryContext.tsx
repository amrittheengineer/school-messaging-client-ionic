import React, { useState, useEffect } from "react";
import request from "../modules/request";
import axios, { Canceler, CancelToken, AxiosResponse } from "axios";
import { GalleryContextInterface, Album } from "../interface/TypeInterface";

export const GalleryContext = React.createContext<GalleryContextInterface | null>(
  null
);
export const GalleryContextProvider = (props: { children: any }) => {
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
  }, [currentAlbum]);

  const [albumList, setAlbumList] = useState<Array<Album>>([]);
  useEffect(() => {
    let cancel: Canceler;
    let source: CancelToken = new axios.CancelToken((c) => {
      cancel = c;
    });

    const { requestPromise } = request("/api/student/albums", {
      method: "GET",
      cancelToken: source,
    });

    requestPromise
      .then((res: AxiosResponse<{ data: Array<Album> }>) => {
        // setAlbumList();
        setAlbumList([...res.data.data]);
      })
      .catch((err) => console.error(err));
  }, []);

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
  }, [currentAlbum]);

  return (
    <GalleryContext.Provider
      value={{
        currentAlbum,
        setCurrentAlbum,
        albumPhotos,
        setAlbumPhotos,
        albumVideos,
        setalbumVideos,
        albumList,
      }}
    >
      {props.children}
    </GalleryContext.Provider>
  );
};
