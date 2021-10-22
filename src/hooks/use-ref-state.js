import { useEffect, useRef, useState } from 'react';

function useRefState(initialValue) {
    const ref = useRef(initialValue);
    const setter = (newValue) => ref.current = newValue;

    return [ref, setter];
}

