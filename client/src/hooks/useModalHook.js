import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import useToggleStateHook from "./useToggleStateHook";

export const useModalHook = () => {
    
    const [errorAlert, toggleErrorAlert] = useToggleStateHook(false);
    const [returnedError, setReturnedError] = useState(null);
    const { onClose } = useDisclosure();

    return {onClose, errorAlert, toggleErrorAlert, returnedError, setReturnedError};
}