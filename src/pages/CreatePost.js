import React, { useEffect } from "react";
import { useState } from "react";
import { addDoc, collection, getCountFromServer } from "firebase/firestore";
import { db, auth, storage } from "./firebase-config";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { isspace } from "./Home";

function CreatePost({ isAuth }) {
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");

  const postsCollectionRef = collection(db, "posts");
  let navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [urls, setUrls] = useState("");
  const [type, setType] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const urlarray = [];
  const uploadImage = () => {
    if (image === null) return;

    const subfolder = "post" + v4();
    let uploadNumber = 0;
    for (let i = 0; i < image.length; i++) {
      console.log(image[i].type);
      if (
        image[i].type === "image/jpeg" ||
        image[i].type === "image/png" ||
        image[i].type === "image/jpg"
      ) {
        setType("image");
      } else if (image[i].type === "video/mp4") {
        setType("video");
      }
      const imageRef = ref(
        storage,
        `images/${subfolder}/${image[i].name + v4()}`
      );

      uploadBytes(imageRef, image[i]).then((snap) => {
        getDownloadURL(snap.ref).then((url) => {
          urlarray.push(url);
          uploadNumber++;
          if (uploadNumber === image.length) {
            setUrls(urlarray);
            setUploadStatus("Uploaded!!!!");
          }
        });
      });
    }
  };
  const createPost = async () => {
    if (urls === "" && !isspace(title) && !isspace(postText)) {
      navigate("/");

      return;
    }

    const allposts = await getCountFromServer(postsCollectionRef);
    await addDoc(postsCollectionRef, {
      title,
      postText,
      type,
      urls: urls,
      number_of_posts: allposts.data().count,
      author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });

    navigate("/");
  };
  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h1>Create a Post</h1>
        <div className="inputGp">
          <label>Title :</label>
          <input
            placeholder="Title.."
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="inputGp">
          <label>Post :</label>
          <textarea
            placeholder="Post..."
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
        </div>

        <div>
          <input
            type="file"
            multiple
            onChange={(event) => {
              setImage(event.target.files);
            }}
            
          />
          <br />{" "}
          <p>
            <button onClick={uploadImage} className="add">
              ADD FILE
            </button>
            <h3 className="uploaded">{uploadStatus}</h3>
          </p>
        </div>

        <button onClick={createPost}>Submit Post</button>
      </div>
    </div>
  );
}

export default CreatePost;
