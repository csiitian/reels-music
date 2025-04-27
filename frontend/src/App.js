import './App.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from 'react';
import Home from './components/Home';
import NewSong from './components/NewSong';
import SongView from './components/SongView';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { 
        path: "/", 
        element: <SongView /> 
      },
      {
        path: "/song/:songId/edit",
        element: <NewSong />
      },
      { 
        path: "/song/new", 
        element: <NewSong /> 
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
