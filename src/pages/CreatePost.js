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

  const urlarray = [];
  const uploadImage = () => {
    if (image === null) return;

    const subfolder = "post" + v4();
    for (let i = 0; i < image.length; i++) {
      const imageRef = ref(
        storage,
        `images/${subfolder}/${image[i].name + v4()}`
      );

      uploadBytes(imageRef, image[i]).then((snap) => {
        getDownloadURL(snap.ref).then((url) => {
          urlarray.push(url);
        });
      });
    }
    setUrls(urlarray);
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
          <button onClick={uploadImage} className="add">
            ADD FILE
          </button>
        </div>

        <button onClick={createPost}>Submit Post</button>
      </div>
    </div>
  );
}

export default CreatePost;
