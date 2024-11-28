import api from "@/lib/api";
import { encryptObjectValues } from "@/utils/utils";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useUserContext } from "@/store/userStore";
import { Button } from "../ui/button";
import { LoaderCircle } from "lucide-react";

function Feedback() {
  const { roomId } = useUserContext();
  const [status, setStatus] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [ip, setIp] = useState<string>("");
  useEffect(() => {
    fetch("https://api.ipify.org/").then(async (r) => {
      setIp(await r.text());
    });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const payload: { feedback: string } | any = {};
      formData.forEach((value, key) => {
        payload[key] = value;
      });
      if (!payload.feedback || payload.feedback.trim().length == 0) return;
      if (payload.feedback.trim().length > 170)
        return toast.error("Message to long");
      try {
        setLoader(true);
        await api.post(
          `${process.env.SOCKET_URI}/api/feedback`,
          encryptObjectValues({
            xhr: ip,
            log: payload.feedback,
            nxt: roomId,
          }),
          {
            showErrorToast: false,
          }
        );
      } finally {
        setFeedback("");
        setLoader(false);
        setStatus("Feedback received 😃");
      }
    },
    [ip, roomId]
  );
  return (
    <Dialog>
      <DialogTrigger
        disabled={loader || status ? true : false}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground shadow-sm h-9 bg-purple p-2.5 hover:bg-purple/80"
      >
        📩
      </DialogTrigger>
      <DialogContent className="w-96 max-md:w-[85dvw] flex flex-col items-center justify-center bg-transparent border-none">
        <DialogHeader className="h-0">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className=" flex w-full items-center justify-center">
          <div className="flex w-full backdrop-blur-xl flex-col  overflow-hidden p-7 items-center justify-center h-full border-2 border-white/15 bg-gradient-to-br from-black/45 to-black/25 rounded-[24px]">
            <form onSubmit={handleSubmit} className=" w-full space-y-4">
              <p className=" font-semibold text-2xl">Feedback / Question</p>
              <textarea
                onChange={(e) => setFeedback(e.currentTarget.value)}
                value={feedback}
                maxLength={170}
                disabled={loader || status ? true : false}
                className="flex h-40 w-full rounded-md border border-white/15 outline-none bg-transparent px-3 py-2 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed text-base resize-none disabled:opacity-90"
                placeholder="Type your message here."
                name="feedback"
              />
              <Button
                disabled={loader || status ? true : false}
                variant={"default"}
                className=" w-full mt-2.5 bg-purple hover:bg-purple/80 text-white"
                type="submit"
              >
                {loader ? (
                  <LoaderCircle className=" animate-spin " />
                ) : (
                  <>{status ? status : "Send 🔫"}</>
                )}
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Feedback;
