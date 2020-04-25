const Constant = {
  getStorageURL: (directory: string, fileName: string) =>
    `https://firebasestorage.googleapis.com/v0/b/st-marys-school-d6378.appspot.com/o/${encodeURIComponent(
      directory
    )}%2F${encodeURIComponent(fileName)}?alt=media`,
  // getTime: (time: number) => {
  //   if (time === 0) {
  //     return "Just Now";
  //   } else if (time < 60) {
  //     return `${time} mins ago`;
  //   } else if (time < 24 * 60) {
  //     return `${Math.floor(time / 60)} hrs ago`;
  //   } else {
  //     return `${Math.floor(time / 3600)} days ago`;
  //   }
  // },
  url: "https://st-marys-school-d6378.firebaseapp.com",
  timeSince: (timeStampNum: number) => {
    let timeStamp: Date = new Date(timeStampNum ? timeStampNum : Date.now());
    var now = new Date(),
      secondsPast = Math.trunc((now.getTime() - timeStamp.getTime()) / 1000);
    var day, month, year;
    if (secondsPast < 60) {
      return `Just Now`;
    }
    if (secondsPast < 3600) {
      return Math.ceil(secondsPast / 60) + " minutes ago";
    }
    if (secondsPast <= 86400) {
      return Math.ceil(secondsPast / 3600) + " hours ago";
    }
    if (secondsPast > 86400) {
      day = timeStamp.getDate();
      month = timeStamp
        .toDateString()
        .match(/ [a-zA-Z]*/)![0]
        .replace(" ", "");
      year =
        timeStamp.getFullYear() == now.getFullYear()
          ? ""
          : " " + timeStamp.getFullYear();
      return day + " " + month + " " + year;
    }
  },
  // selectColor: (sub: string) => {
  //   if (sub == "Tamil" || sub == "தமிழ்") {
  //     return "#40739e";
  //   }
  //   if (sub == "Science") {
  //     return "#f0932b";
  //   }
  //   if (sub == "SST") {
  //     return "#70a1ff";
  //   }
  //   if (sub == "English") {
  //     return "#ff7675";
  //   }
  //   if (sub == "Maths") {
  //     return "#00b894";
  //   }
  //   if (sub == "Hindi") {
  //     return "#7f8fa6";
  //   }
  // },
  // selectImageUri: (sub: string) => {
  //   if (sub == "Tamil" || sub == "தமிழ்") {
  //     return require("./src/images/Tamil.png");
  //   }
  //   if (sub == "Science") {
  //     return require("./src/images/Science.png");
  //   }
  //   if (sub == "SST") {
  //     return require("./src/images/SST.png");
  //   }
  //   if (sub == "English") {
  //     return require("./src/images/English.png");
  //   }
  //   if (sub == "Maths") {
  //     return require("./src/images/Maths.png");
  //   }
  //   if (sub == "Hindi") {
  //     return require("./src/images/Hindi.png");
  //   }
  // },
};
export default Constant;
