import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { db } from "../firebase";
import { createChat } from "../models/chatModel";
import { useUser } from "../contexts/UserContext";
const FormModal = () => {
  const { currentUser } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState<string>("");
  const [foundusers, setFoundusers] = useState<any>([]);
  const [participants, setParticipants] = useState<any>([
    currentUser?.uid,
  ]);
  const handleSearch = async () => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("displayName", ">=", username));
      const querySnapshot = await getDocs(q);
      const matchingUsers = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((user) =>
          user.displayName.toLowerCase().includes(username.toLowerCase())
        );
      setFoundusers(matchingUsers);
      console.log(matchingUsers);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddNewChat = async (id: string) => {
    const newParticipants = participants ? [...participants, id] : [id];
    setParticipants(newParticipants);

    try {
      await createChat(newParticipants);
      console.log("User chat created");
      onClose();
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };
  return (
    <>
      <button className="bg-slate-800 rounded-lg p-2" onClick={onOpen}>
        <img src="/plus.png" className="w-6" alt="Add Chat" />
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add user to your chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <ul className="mt-4">
              {foundusers.map((user: FirebaseUser) => (
                <li
                  key={user.uid}
                  className="bg-slate-300 rounded-lg p-3 mt-3 flex justify-between "
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.photoURL || "/avatar.png"}
                      className="w-10 h-10 rounded-full"
                      alt=""
                    />
                    <p className="text-md font-semibold">{user.displayName}</p>
                  </div>
                  <button
                    onClick={() => handleAddNewChat(user.uid)}
                    className="bg-blue-700 text-sm text-semibold px-1 text-white rounded"
                  >
                    Add to chat
                  </button>
                </li>
              ))}
            </ul>
          </ModalBody>

          <ModalFooter>
            <button
              className="bg-blue-700 text-white  rounded-lg p-2"
              onClick={handleSearch}
            >
              Search
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FormModal;
