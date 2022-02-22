import React from 'react';
import { useRouter } from 'next/router'

export default function Items() {
    const router = useRouter()
    const { id } = router.query

    return(
        <h1>Post: {id}</h1>
    );
}