import Blur from "@/components/Blur";
import AddToQueue from "@/components/common/AddToQueue";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Player from "@/components/common/Player";
import Background from "../Background";

export default function Home() {
  return (
    <>
      <Background />
      <Blur />
      <div className="bg-cover absolute w-full top-0 flex flex-col items-center justify-center h-full py-4">
        <Header />

        <div className="max-md:w-full max-md:gap-0 h-full z-40 flex-wrap flex overflow-hidden max-md:overflow-scroll py-4 gap-4 w-7/12">
          <Player />
          <AddToQueue />
        </div>
        <Footer />
      </div>
    </>
  );
}
