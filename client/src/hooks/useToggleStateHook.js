import { useState } from 'react';

function useToggleStateHook(initialVal = false){
    const [state, setState] = useState(initialVal);
    const toggle = () =>{
        setState(!state);
    };

    return [state, toggle];
}

export default useToggleStateHook;