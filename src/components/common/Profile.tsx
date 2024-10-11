"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserContext } from "@/app/store/userStore";
import Image from "next/image";
import { TUser } from "@/lib/types";
import { useEffect } from "react";
import { Button } from "../ui/button";
import api from "@/lib/api";
import Login from "./Login";
import { toast } from "sonner";
function Profile({ user }: { user: TUser }) {
  const { setUser, roomId } = useUserContext();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);
  useEffect(() => {
    if (!user && roomId) {
      toast.warning("Login to join room " + roomId);
    }
  }, [user, roomId]);
  if (!user) {
    return <Login />;
  }
  return (
    <Dialog key={"user profile"}>
      <DialogTrigger>
        <div className=" size-10 cursor-pointer">
          <Image
            width={500}
            height={500}
            alt="Profile"
            className=" rounded-full"
            src={user?.imageUrl || "https://imagedump.vercel.app/notFound.jpg"}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="w-fit border-none bg-transparent p-0">
        <DialogTitle className=" w-fit" />
        <div className="w-fit  flex items-center justify-center">
          <div className="flex flex-col bg-black/80 p-5 items-center justify-center w-[20rem] overflow-hidden rounded-2xl">
            <div className=" size-24 cursor-pointer">
              <Image
                width={500}
                height={500}
                alt="Profile"
                className=" rounded-full"
                src={
                  user?.imageUrl || "https://imagedump.vercel.app/notFound.jpg"
                }
              />
            </div>
            <p className=" my-4">
              {user?.name} ({user?.username})
            </p>
            <Button
              onClick={async () => {
                const res = await api.get("/api/logout");
                if (res.success) {
                  window.location.reload();
                }
              }}
            >
              Logout
            </Button>
            {/* <form className=" flex gap-2.5 mt-4 mb-1.5 w-full flex-col">
   {/* <Input placeholder="ID" readOnly value={user?._id} /> */}

            {/* <Input
     placeholder="username"
     name="username"
     defaultValue={user?.username}
   />
   <DialogClose>
     <Button variant={"secondary"} className="w-full">
       Update
     </Button>
   </DialogClose> */}
            {/* </form> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Profile;
