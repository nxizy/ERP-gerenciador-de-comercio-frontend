"use client"
import { useParams } from "next/navigation"

export default function ManageClientPage() {
    const params = useParams();
    const id = params.id
    return(
        <h1>Este é o cliente {id}</h1>
    )

}