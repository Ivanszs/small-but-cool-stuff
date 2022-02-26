const tiles = Array.from(document.querySelectorAll(".tile"));
const emptyTile = document.querySelector(".tile--empty");
const footer = document.querySelector(".footer");

//set the interactions, for example: if blank tile is in A, then only B and D can be accessed
const charInteractions = {
  A: ["B", "D"],
  B: ["A", "C", "E"],
  C: ["B", "F"],
  D: ["A", "E", "G"],
  E: ["B", "D", "F", "H"],
  F: ["C", "E", "I"],
  G: ["D", "H"],
  H: ["G", "E", "I"],
  I: ["F", "H"]
};

console.log('hola')
console.log('chau')

//lock/unlock tiles with .disabled
const unlockTiles = currentTileArea => {
  tiles.map(tile => {
    const tileArea = tile.style.getPropertyValue("--char");
    if (charInteractions[currentTileArea].includes(tileArea)) {
      tile.disabled = false;
    } else {
      tile.disabled = true;
    }
  });
  isComplete(tiles);
};

//onclick events to get position of clicked tile, blank tile, update them and unlock the corresponding ones
tiles.map(tile => {
  tile.addEventListener("click", event => {
    const tileArea = tile.style.getPropertyValue("--char");
    const emptyTileArea = emptyTile.style.getPropertyValue("--char");
    emptyTile.style.setProperty("--char", tileArea);
    tile.style.setProperty("--char", emptyTileArea);
    unlockTiles(tileArea);
  });
});

//get current positions and compare with the solved puzzle positions
const isComplete = tiles => {
  const currentTilesString = tiles
    .map(tile => tile.style.getPropertyValue("--char"))
    .toString();
  if (currentTilesString == Object.keys(charInteractions).toString()) {
    footer.innerHTML = "YOU WIN!";
  }
};

//check if the current shuffle is solvable, logic from https://www.geeksforgeeks.org/check-instance-15-puzzle-solvable/
const inversions = array => {
  return array.reduce((accumulator, current, index, array) => {
    return array
      .slice(index)
      .filter(item => {
        return item < current;
      })
      .map(item => {
        return [current, item];
      })
      .concat(accumulator);
  }, []).length;
};

const shuffler = keys => Object.keys(keys).sort(() => .5 - Math.random());

//start the game, show tiles in order, shuffle and check if solvable after 2.5 seconds and lock/unlock tiles
setTimeout(() => {
  let startingAreas = Object.keys(charInteractions);
  while (inversions(startingAreas) % 2 == 1 || inversions(startingAreas) == 0) {
    startingAreas = shuffler(charInteractions);
  }
  tiles.map((tile, index) => {
    tile.style.setProperty("--char", startingAreas[index]);
  });
  unlockTiles(emptyTile.style.getPropertyValue("--char"));
}, 2500);
