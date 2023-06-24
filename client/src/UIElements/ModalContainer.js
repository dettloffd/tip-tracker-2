import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

export const ModalContainer = (props) => {
  const handleClose = () => {
    props.toggleOpenState();
    if (props.setReturnedError) {
      props.setReturnedError(null);
    }
  };

  return (
    <>
      <Modal isOpen={props.isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalCloseButton onClick={handleClose} />
          <ModalBody>{props.modalContent}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
