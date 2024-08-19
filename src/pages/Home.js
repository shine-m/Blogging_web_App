import React, { useEffect, useState } from "react";
import { getDocs, collection, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { auth, storage } from "./firebase-config";
import { ref, deleteObject } from "firebase/storage";

function isspace(x) {
  for (let i of x) {
    if (i !== " ") return true;
  }
  return false;
}

function Home({ isAuth }) {
  const [postLists, setPostLists] = useState([]);
  const postsCollectionRef = collection(db, "posts");
  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostLists(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, []);

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id.id);
    if (id.urls !== null) {
      for (let i = 0; i < id.urls.length; i++) {
        const desertRef = ref(storage, id.urls[i]);
        deleteObject(desertRef);
      }
    }
    await deleteDoc(postDoc);
    window.location.reload();
  };
  return (
    <div className="homePage">
      <h1>⌂ Blogs </h1>
      {postLists.map((post) => {
        return (
          <div className="post" key={post.id}>
            <div className="postHeader">
              <div className="title">
                <h1>{post.title}</h1>
              </div>
              <div className="deletePost">
                {isAuth && post.author.id === auth.currentUser.uid && (
                  <button
                    onClick={() => {
                      deletePost(post);
                    }}
                  >
                    {" "}
                    &#128465;
                  </button>
                )}
              </div>
            </div>

            {post.type === "image" &&
              post.urls.map((a) => {
                return (
                  <div>
                    <a href={a}>
                      <img src={a} />
                    </a>
                  </div>
                );
              })}
            {post.type === "video" &&
              post.urls.map((a) => {
                return (
                  <div>
                    <video
                      controls="controls"
                      poster="https://firebasestorage.googleapis.com/v0/b/blog-project-3100.appspot.com/o/images%2Fpost597d32a6-f3f7-491c-a797-f01ede732c74%2F178.jpgd533ee3b-d8ea-4cbb-a735-f74cd1d7c32d?alt=media&token=cf8d1cf5-8bc3-45df-b55c-983c9a2e70be&_gl=1*s0dikb*_ga*NzgyMjI1MDk3LjE2OTEwMDQyODM.*_ga_CW55HF8NVT*MTY5Njg2OTY3NS40Ni4xLjE2OTY4NzAxMzcuNTYuMC4w"
                      mute="true"
                    >
                      <source src={a} type="video/mp4" />
                    </video>
                  </div>
                );
              })}

            {isspace(post.postText) && (
              <div className="postTextContainer">👉{post.postText}</div>
            )}

            <h3>@{post.author.name}</h3>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
export { isspace };
