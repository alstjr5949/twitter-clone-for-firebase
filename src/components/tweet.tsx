import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../routes/firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0;
  font-size: 18px;
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: black;
  color: white;
  font-weight: 600;
  border: 1px solid white;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TweetTextArea = styled.textarea`
  border: none;
  border-bottom: 1px solid white;
  background-color: transparent;
  color: white;
  resize: none;
  font-size: 18px;
`;

const EditCompleteButton = styled.button`
  background-color: white;
  color: black;
  font-weight: 600;
  border: 1px solid white;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const [editMode, setEditMode] = useState(false);
  const [editTweet, setEditTweet] = useState(tweet);

  const user = auth.currentUser;
  const isSameUser = user?.uid === userId;

  const handleDeleteButtonClick = async () => {
    const ok = confirm("Are you sure want to delete this tweet?");

    if (!isSameUser || !ok) return;

    try {
      await deleteDoc(doc(db, "tweets", id));

      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);

        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const handleEditButtonClick = async () => {
    setEditMode(true);
  };

  const handleTweetTextAreaInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setEditTweet(e.target.value);
  };

  const handleEditFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isSameUser || !editTweet || editTweet.length > 180) return;

    try {
      await updateDoc(doc(db, "tweets", id), {
        tweet: editTweet,
      });

      setEditMode(false);
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  return (
    <Wrapper>
      {editMode ? (
        <EditForm onSubmit={handleEditFormSubmit}>
          <Username>{username}</Username>
          <TweetTextArea onInput={handleTweetTextAreaInput} value={editTweet} />
          <EditCompleteButton type="submit">Edit Complete</EditCompleteButton>
        </EditForm>
      ) : (
        <Column>
          <Username>{username}</Username>
          <Payload>{tweet}</Payload>
          {isSameUser && (
            <ButtonWrapper>
              <DeleteButton onClick={handleDeleteButtonClick}>
                Delete
              </DeleteButton>
              <EditButton onClick={handleEditButtonClick}>Edit</EditButton>
            </ButtonWrapper>
          )}
        </Column>
      )}
      {photo && (
        <Column>
          <Photo src={photo} />
        </Column>
      )}
    </Wrapper>
  );
}
