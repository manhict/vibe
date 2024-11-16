import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useUserContext } from "@/store/userStore";
import { onBoarding } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { encryptObjectValues } from "@/utils/utils";
import api from "@/lib/api";
import { AtSign, LoaderCircle, Sun } from "lucide-react";
import { socket } from "@/app/socket";

function OnBoarding() {
  const { user, setUser } = useUserContext();
  const [inputValue, setInputValue] = useState(user?.username);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(() => {
    const data =
      typeof window !== "undefined" ? localStorage.getItem("o") : false;
    return data ? JSON.parse(data) : true;
  });
  const formRef = useRef<HTMLFormElement>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleOnboarding = async () => {
    if (currentStep == 0 && formRef.current) {
      const event = new Event("submit", { bubbles: true, cancelable: true });
      formRef.current.dispatchEvent(event);
      return;
    }
    if (currentStep !== onBoarding.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }
    localStorage.setItem("o", "false");
    setShowOnboarding(false);
  };

  const handleUpdate = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const payload: { name: string; username: string } | any = {};
      formData.forEach((value, key) => {
        payload[key] = value;
      });
      // if (user && payload.username == user.username) {
      //   setCurrentStep((prev) => prev + 1);
      //   return;
      // }

      setLoader(true);
      const res = await api.put(
        `${process.env.SOCKET_URI}/api/update`,
        encryptObjectValues(payload)
      );
      if (res.error) {
        setError(res.error);
      }
      if (res.success) {
        socket.emit("profile");
        setError(null);
        setCurrentStep((prev) => prev + 1);
        if (user) {
          setUser(() => ({
            ...user,
            username: payload.username,
            name: payload.name,
          }));
        }
      }
      setLoader(false);
    },
    [user, setUser]
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  const contentVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <Dialog key="user Login" open={showOnboarding || false}>
      <DialogTrigger className="absolute h-0 w-0 p-0" />
      <DialogContent className="w-fit flex flex-col items-center justify-center bg-transparent border-none">
        <DialogHeader className="h-0">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className=" w-[346px] h-[414px] flex flex-col gap-4 bg-gradient-to-t to-zinc-800/60  overflow-hidden from-zinc-600/50 gradient rounded-[28px] shadow-md"
        >
          {user && showOnboarding && (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentStep}
                custom={currentStep}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
                className="flex flex-col h-full"
              >
                <div
                  className={`${
                    currentStep == 4
                      ? "h-1/3 mb-2"
                      : currentStep == 0
                      ? ""
                      : "bg-black h-1/2 "
                  } `}
                >
                  {currentStep == 4 ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="p-7 pb-0"
                    >
                      <Avatar className="size-32 ">
                        <AvatarImage
                          width={500}
                          height={500}
                          alt="Profile"
                          className="rounded-full object-cover"
                          src={
                            user?.imageUrl ||
                            "https://imagedump.vercel.app/notFound.jpg"
                          }
                        />
                        <AvatarFallback>SX</AvatarFallback>
                      </Avatar>
                    </motion.div>
                  ) : (
                    <>
                      {currentStep !== 0 && (
                        <video
                          preload="true"
                          playsInline
                          src={onBoarding[currentStep].src}
                          className="h-full w-full object-cover"
                          muted
                          loop
                          autoPlay
                        />
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-col justify-between flex-grow">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="px-7 mt-5"
                  >
                    <p className="font-semibold text-3xl pb-1">
                      {currentStep == 4
                        ? `${user.name.split(" ")[0]}, Set your vibe`
                        : onBoarding[currentStep].heading}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {onBoarding[currentStep].description}
                    </p>
                    {currentStep == 0 && (
                      <form
                        ref={formRef}
                        onChange={() => error && setError(null)}
                        onSubmit={handleUpdate}
                        className="w-full space-y-3 my-5"
                      >
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          <div className=" relative flex items-center">
                            <Sun className=" size-4 ml-2 text-zinc-400 absolute" />
                            <Input
                              maxLength={15}
                              max={15}
                              min={4}
                              placeholder="name"
                              name="name"
                              className="py-5 pl-7"
                              defaultValue={user?.name}
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className=" relative flex items-center">
                            <AtSign className=" size-4 ml-2 text-zinc-400 absolute" />
                            <Input
                              maxLength={15}
                              max={15}
                              min={4}
                              value={inputValue}
                              onChange={(e) =>
                                setInputValue(e.target.value.toLowerCase())
                              }
                              placeholder="username"
                              name="username"
                              className="py-5 pl-7"
                              defaultValue={user?.username}
                            />
                          </div>
                        </motion.div>

                        {error && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs p-0.5 text-red-400"
                          >
                            {error}
                          </motion.p>
                        )}
                      </form>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex w-full items-center justify-between p-7"
                  >
                    {currentStep == 1 && (
                      <p
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                        className="text-zinc-400 text-base "
                      >
                        Back
                      </p>
                    )}
                    {currentStep !== 4 && (
                      <p
                        onClick={() => {
                          localStorage.setItem("o", "false");
                          setShowOnboarding(false);
                        }}
                        style={{
                          opacity: currentStep == 0 || currentStep == 1 ? 0 : 1,
                        }}
                        className="text-zinc-300 text-base "
                      >
                        Skip
                      </p>
                    )}

                    <Button
                      disabled={loader}
                      className={`${
                        currentStep == 4
                          ? "w-full bg-[#9747FF] py-5 hover:bg-[#9747FF]/80 text-white focus:outline-none outline-[#9747FF]"
                          : ""
                      }`}
                      onClick={handleOnboarding}
                      size={"lg"}
                    >
                      {loader ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        onBoarding[currentStep].ctaText
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default OnBoarding;
