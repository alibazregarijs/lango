import React from "react";
import { Button } from "@/components/ui/button";
import { Message } from "iconsax-reactjs";
import Notification from "@/components/Notification";
import { Modal } from "@/components/Modal";
import Searchbar from "@/components/Searchbar";
const ChatRequest = ({
  setIsModalOpen,
  isModalOpen,
}: {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
}) => {
  return (
    <div className="flex lg:flex-col flex-row justify-between lg:justify-center items-center bg-black-2 rounded-xl p-4 mb-6 space-y-0 lg:space-y-4">
      <div className="flex-center">
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="bg-transparent flex items-center gap-2 cursor-pointer"
        >
          <Message size="24" color="#F97535" />
          <span>Chat with someone</span>
        </Button>
      </div>
      <div className="flex-center">
        <Notification />
      </div>

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Content>
          <Modal.Section title="Search for people and chat with them">
            <Searchbar users={true} setIsModalOpen={setIsModalOpen} />
          </Modal.Section>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default ChatRequest;
