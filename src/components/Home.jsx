import React from "react";
import Header from "./templates/Header";
import SideNav from "./templates/SideNav";
import TopNav from "./templates/TopNav";

const Home = () => {
  document.title = "KV | Homepage";

  return (
    <>
      <div className="w-full h-full flex">
        <SideNav />
        <div className="w-[80%] h-full">
          <TopNav />
          <Header />
        </div>
      </div>
    </>
  );
};

export default Home;