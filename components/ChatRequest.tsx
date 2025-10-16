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
      <div className="flex flex-col">
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 cursor-pointer xl:p-2! p-[2px]!"
        >
          <Message size="24" color="#F97535" className="truncate" />
          <span className="truncate xl:text-[14px] text-[12px]">Chat with someone</span>
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
