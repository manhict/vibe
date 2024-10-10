"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/config/firebase";
import api from "@/lib/api";
import { useUserContext } from "@/app/store/userStore";
import { TUser } from "@/lib/types";
import { LogIn } from "lucide-react";
function Login() {
  const { setUser } = useUserContext();
  const handleLogin = () => {
    signInWithPopup(auth, provider).then(async (result) => {
      const user = result.user;
      if (user) {
        const res = await api.post("/api/login", user);
        if (res.success) {
          setUser((res.data as any).data as TUser);
          window.location.reload();
        }
      }
    });
  };
  return (
    <Dialog key={"user Login"}>
      <DialogTrigger className=" border max-md:px-0 max-md:border-none border-[#79747E] h-full flex justify-center items-center px-5 rounded-xl text-base">
        <p className=" max-md:hidden">Login / SignUp</p>
        <LogIn className=" size-6 text-zinc-200 hidden max-md:block" />
      </DialogTrigger>
      <DialogContent className="w-fit flex items-center justify-center bg-transparent border-none">
        <div className=" w-fit flex flex-col h-72 p-6 justify-between bg-zinc-500 rounded-2xl shadow-md">
          <div>
            <h1 className=" font-semibold text-2xl mb-2">Login Or SignUp</h1>
            <p className=" text-zinc-400 text-xl">
              lets get to know <br /> each other.
            </p>
          </div>
          <Button
            onClick={handleLogin}
            className=" gap-1.5 items-center shadow-none px-7 py-5"
          >
            <FcGoogle className=" size-5" />
            Sign up with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Login;
