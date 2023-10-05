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
            {post.urls.map((a) => {
              return (
                <div>
                  <a href={a}>
                    <img src={a} />
                  </a>
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
