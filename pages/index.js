import Head from 'next/head'
import { userService } from "../services";
import { useState, useEffect } from "react";


export default function Home() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(userService.userValue);
      }, []);
  return (
    <div className="container">
      

     
<section class="min-h-screen flex flex-col">
           
          
                        <h1 class="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600">
                            User {user?.name}
                        </h1>

                    <a
                    href={`/users/edit/${user?.id}`}
                    className="hover:underline"
                  >
                    Edit
                  </a>
                  
        </section>



  
   
    </div>
  )
}
