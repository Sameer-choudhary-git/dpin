"use client"
import {BACKEND_URL} from "@/configs/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useState,useEffect } from "react";

interface Website {
    id: string;
    name: string;
    userId: string;
    deleted : boolean;
    url: string;
    tick:{
        id: string;
        createdAt: string;
        status: string;
        latency: number;
    }[];
    checkInterval: number;
    updatedAt: string;
}
 
export function useWebsites() {
    const {getToken} = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);
    async function fetchWebsites() {
        const token = await getToken();
        const response = await axios.get(`${BACKEND_URL}/api/v1/websites`, {
            headers: {
                Authorization: token
            }
        });
        console.log(response.data); 
        setWebsites((response.data as { websites: Website[] }).websites);
    }

    useEffect(() => {
        fetchWebsites();
        const interval = setInterval(()=>{
            fetchWebsites();
        }, 1000*60);
        return () => clearInterval(interval);
    }, []);

    return { websites, fetchWebsites };
}