import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../routes/firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: auto;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );

      // const snapshot = await getDocs(tweetsQuery);
      // const tweetsData = snapshot.docs.map((doc) => {
      //   const { tweet, createdAt, userId, username, photo } = doc.data();

      //   return {
      //     id: doc.id,
      //     tweet,
      //     createdAt,
      //     userId,
      //     username,
      //     photo,
      //   };
      // });

      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweetsData = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();

          return {
            id: doc.id,
            tweet,
            createdAt,
            userId,
            username,
            photo,
          };
        });

        setTweets(tweetsData);
      });
    };

    fetchTweets();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
