import { FC } from "react";
import SideBar from "../components/Home/SideBar";

const Home: FC = () => {
  return (
    <div className="flex" style={{minHeight: '400px', minWidth: '800px'}}>
      <SideBar />

      <div className="hidden flex-grow flex-col items-center justify-center gap-3 md:!flex">
        <h1 className="text-center">Select a conversation to start chatting</h1>
      </div>
    </div>
  );
};

export default Home;
