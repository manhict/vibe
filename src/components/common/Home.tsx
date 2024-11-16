import Blur from "@/components/Blur";
import AddToQueue from "@/components/common/AddToQueue";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Player from "@/components/common/Player";
import Background from "../Background";
import { ContextMenu, ContextMenuTrigger } from "../ui/context-menu";
import Context from "./Context";
import Reconnect from "./Reconnect";

export default function Home() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Background />
        <Blur />
        <Reconnect />
        <div className="bg-cover absolute w-full top-0 flex flex-col items-center justify-center h-full md:py-2.5">
          <Header />

          <div className="max-md:w-full max-md:gap-0 h-full z-40 flex-wrap flex overflow-hidden max-xl:w-11/12 max-lg:w-11/12 max-sm:w-full max-md:overflow-scroll hide-scrollbar py-4 max-md:py-0 gap-4 w-7/12">
            <Player />

            <AddToQueue />
          </div>

          <Footer />
        </div>
        <Context />
      </ContextMenuTrigger>
    </ContextMenu>
  );
}
