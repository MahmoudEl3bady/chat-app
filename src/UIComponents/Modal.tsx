import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { db } from "../firebase";
import { createChat } from "../models/chatModel";
import { useUser } from "../contexts/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
const FormModal = () => {
  const { currentUser } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState<string>("");
  const [foundusers, setFoundusers] = useState<any>([]);
  const toast = useToast();
  const queryClient = useQueryClient();
  const handleSearch = async () => {
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("displayName", ">=", search));
      const querySnapshot = await getDocs(q);
      const matchingUsers = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((user) =>
          user.displayName.toLowerCase().includes(search.toLowerCase().trim())
        );
      setFoundusers(matchingUsers);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (search.length > 0) {
      handleSearch();
    } else {
      setFoundusers([]);
    }
  }, [search]);

  const createChatMutation = useMutation({
    mutationFn: (participants: string[]) => createChat(participants),
    onSuccess: () => {
      // Invalidate and refetch the chats query
      queryClient.invalidateQueries({ queryKey: ["chats", currentUser?.uid] });
      toast({
        title: "Chat created successfully",
        status: "success",
        duration: 3000,
        position: "top",
        isClosable: true,
      });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating chat:", error);
      toast({
        title: "Error creating chat",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });
  const handleAddNewChat = async (id: string) => {
    const participants: any = [currentUser?.uid, id].filter(Boolean);
    await createChatMutation.mutateAsync(participants);
  };
  return (
    <>
      <button className="bg-slate-800 rounded-lg p-2" onClick={onOpen}>
        <img src="/plus.png" className="w-6" alt="Add Chat" title="Add new Chat" />
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                autoFocus
              />
            </FormControl>
            <ul className="mt-4">
              {foundusers.length > 0 ? (
                foundusers.map((user: FirebaseUser) => (
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
                      <p className="text-md font-semibold">
                        {user.displayName}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddNewChat(user.uid)}
                      className="bg-blue-700 text-sm text-semibold px-1 text-white rounded"
                    >
                      Add to chat
                    </button>
                  </li>
                ))
              ) :
              search && (
                <h2 className="text-center text-xl font-semibold text-red-800">
                  No users found!
                </h2>
              )}
            </ul>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FormModal;
