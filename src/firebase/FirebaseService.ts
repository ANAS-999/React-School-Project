import { getAuth } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./FirebaseConfig";
import type { LibraryModel } from "../models/LibraryModel";

export const addMovieTolibrary = async (movie: LibraryModel) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("You Must be logged in");
    return;
  }

  const uid = user.uid;

  try {
    await setDoc(doc(db, "users", uid, "Movies-Library", movie.id.toString()), {
      title: movie.title,
      image: movie.image,
      createdAt: new Date(),
    });
    console.log("  Added to library");
  } catch (error) {
    console.error(error);
  }
};
export const fetchMovieToLibrary = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return [];
  // collection name must match the one used when adding documents
  const snapshot = await getDocs(
    collection(db, "users", user.uid, "Movies-Library"),
  );
  return snapshot.docs.map((doc) => doc.id);
};

export const removeMovieFromLibrary = async (movieId: string | number) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return;

  try {
    await deleteDoc(
      doc(db, "users", user.uid, "Movies-Library", movieId.toString()),
    );

    console.log("Movie removed ✅");
  } catch (error) {
    console.error(error);
  }
};
export const addGameToLibrary = async (game: LibraryModel) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("You Must be logged in");
    return;
  }

  const uid = user.uid;

  try {
    await setDoc(doc(db, "users", uid, "Games-Library", game.id.toString()), {
      title: game.title,
      image: game.image,
      createdAt: new Date(),
    });
    console.log("  Added to library");
  } catch (error) {
    console.error(error);
  }
};

export const removeGameFromLibrary = async (GameId: string | number) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return;

  try {
    await deleteDoc(
      doc(db, "users", user.uid, "Game-Library", GameId.toString()),
    );

    console.log("Game removed ");
  } catch (error) {
    console.error(error);
  }
};

export const addAnimeTolibrary = async (anime: LibraryModel) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("You Must be logged in");
    return;
  }

  const uid = user.uid;

  try {
    await setDoc(doc(db, "users", uid, "Animes-Library", anime.id.toString()), {
      title: anime.title,
      image: anime.image,
      createdAt: new Date(),
    });
    console.log(" Added to library");
  } catch (error) {
    console.error(error);
  }
};

export const removeAnimeFromLibrary = async (AnimeId: string | number) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return;

  try {
    await deleteDoc(
      doc(db, "users", user.uid, "Anime-Library", AnimeId.toString()),
    );

    console.log("Anime removed ");
  } catch (error) {
    console.error(error);
  }
};
