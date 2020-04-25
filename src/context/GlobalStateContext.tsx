import React, { createContext, useState, useEffect } from "react";
import axios, { Canceler, AxiosResponse } from "axios";
import request from "../modules/request";

interface GlobalStateContextInterface {
  user: User | null;
  setUser: (user: User) => void;
  classAnnouncements: Array<ClassAnnouncement>;
  updateClassAnnouncements: (callback: () => void) => void;
  announcements: Array<Announcement>;
  updateAnnouncements: (callback: () => void) => void;
}

interface User {
  name: string;
  phone: string;
  batchId: string;
}

interface ClassAnnouncement extends Broadcast {
  subject: string;
}
interface Announcement extends Broadcast {
  photos: Array<string> | null;
  videos: Array<string> | null;
  url: Array<URLObject>;
}
interface URLObject {
  thumbnail: string;
  url: string;
  title: string | null;
}

interface Broadcast {
  message: string;
  timeStamp: number;
  id: string;
}

export const GlobalStateContext = createContext<GlobalStateContextInterface | null>(
  null
);

export const GlobalStateContextProvider = (props: { children: any }) => {
  const [announcements, setAnnouncements] = useState<Array<Announcement>>([]);
  const [classAnnouncements, setClassAnnouncements] = useState<
    Array<ClassAnnouncement>
  >([]);
  const [user, setUser] = useState<User | null>({
    name: "Amrit",
    phone: "6385141855",
    batchId: "03ee1740-7b40-11ea-881d-4f34ce240b83",
  });

  const updateAnnouncements = (callback: () => void) => {
    if (user && user.batchId) {
      setAnnouncements((prev) => []);
      console.log("Updating Announcements state");
      const { requestPromise } = request(
        "/api/student/announcements/" + Date.now(),
        { method: "GET" }
      );
      requestPromise
        .then((res) => {
          const { data } = res.data;
          // console.log(data.data);
          setAnnouncements((prev) => data);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          if (callback) callback();
        });
    }
  };
  const updateClassAnnouncements = (callback: () => void) => {
    if (user && user.batchId) {
      setClassAnnouncements((prev) => []);
      console.log("Updating Class announcements state");
      const { requestPromise } = request(
        "/api/student/class-announcements/" + user.batchId,
        { method: "GET" }
      );

      requestPromise
        .then((res) => {
          const data = res.data;
          console.log(data.length);
          setClassAnnouncements((prev) => data);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          if (callback) callback();
        });
    }
  };

  useEffect(() => {
    let cancel1: Canceler, cancel2: Canceler;
    if (user && user.batchId) {
      console.log("Changed Class announcements state");
      let source1 = new axios.CancelToken((c) => {
        cancel1 = c;
      });
      let source2 = new axios.CancelToken((c) => {
        cancel2 = c;
      });
      const requestPromise1 = request(
        "/api/student/class-announcements/" + user.batchId,
        { method: "GET", cancelToken: source1 }
      ).requestPromise;
      const requestPromise2 = request(
        "/api/student/announcements/" + Date.now(),
        { method: "GET", cancelToken: source2 }
      ).requestPromise;

      requestPromise1
        .then((res: AxiosResponse<Array<ClassAnnouncement>>) => {
          const data = res.data;
          setClassAnnouncements([
            ...data.sort((next, current) => current.timeStamp - next.timeStamp),
          ]);
        })
        .catch((err) => console.log(err));

      requestPromise2
        .then((res) => {
          const { data } = res.data;
          console.log(data);

          setAnnouncements([...data]);
        })
        .catch((err) => console.log(err));
    }
    return () => {
      if (cancel1) cancel1();
      if (cancel2) cancel2();
    };
  }, [user]);
  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged(fuser => {
  //     if (fuser) {
  //       console.log(fuser);
  //       setUser(fuser);

  //       // Stop the login flow / Navigate to next page
  //       // Stack navigate to next screen
  //     }
  //   });
  // }, []);

  return (
    <GlobalStateContext.Provider
      value={{
        user,
        setUser,
        classAnnouncements,
        updateClassAnnouncements,
        announcements,
        updateAnnouncements,
      }}
    >
      {props.children}
    </GlobalStateContext.Provider>
  );
};
// export GlobalStateContextProvider;
