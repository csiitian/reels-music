import { useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import BottomTrack from "./BottomTrack";

const Home = () => {
  const [selectedTrack, setSelectedTrack] = useState();

  const handleTrackChange = (track) => {
    setSelectedTrack(track);
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="sticky top-0 z-10">
        <Nav />
      </div>

      <main className="flex-grow flex-col items-center">
        <Outlet context={{ handleTrackChange }} />
      </main>

      {selectedTrack && ( // shoudl be at the bottom of screen
        <div className="mt-4 text-white p-4 w-full bottom-0 sticky z-10">
          <BottomTrack selectedTrack={selectedTrack} />
        </div>)}
    </div>
  );
}

export default Home;