import { useEffect, useState } from "react";

import "./App.css";
import BottomSheet from "./sheet";

function randomInteger(max) {
  return Math.floor(Math.random() * (max + 1));
}

function randomRgbColor() {
  let r = randomInteger(255);
  let g = randomInteger(255);
  let b = randomInteger(255);
  return [r, g, b];
}

function randomHexColor() {
  let [r, g, b] = randomRgbColor();

  let hr = r.toString(16).padStart(2, "0");
  let hg = g.toString(16).padStart(2, "0");
  let hb = b.toString(16).padStart(2, "0");

  return "#" + hr + hg + hb;
}

const items = [...Array(100)].map((item, key) => (
  <div
    key={key}
    style={{
      backgroundColor: String(randomHexColor()),
      width: 100,
      height: 100,
      margin: "12px",
      display: "inline-block",
    }}
  />
));

function App() {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
  };

  const toggleBottmSheet = () => {
    if (open) close();
    else openBottomsheet();
  };

  const openBottomsheet = () => {
    setOpen(true);
  };

  const [index, setindex] = useState(0);

  function changeIndex(index) {
    setindex(index);
  }

  return (
    <div className="app">
      <button className="toggle-btn" onClick={toggleBottmSheet}>
        TOGGLE
      </button>

      <button className="toggle-btn" onClick={openBottomsheet}>
        OPEN
      </button>
      <button className="toggle-btn" onClick={close}>
        CLOSE
      </button>

      <BottomSheet
        open={open}
        close={close}
        changeIndex={changeIndex}
        nonblocking={index > 0 ? false : true}
        snapPoints={[100, 600]}
      >
        <div>
          <p>current index {index}</p>
          {items}
        </div>
      </BottomSheet>
    </div>
  );
}

export default App;
