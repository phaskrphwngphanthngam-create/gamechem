// maps.js
// โครงสร้างแมพ: 0/1/D
// '1' = กำแพง, ช่องว่าง (0) = พื้นเดินได้, 'D' = ประตู

const TILE = 40;

function makeMap(layoutRows, doorTargets) {
  return { layout: layoutRows, doors: doorTargets };
}

const maps = {
  map1: makeMap(
    [
      "111111111111",
      "100000000001",
      "100000000001",
      "100000000001",
      "100000000D01",
      "100000000001",
      "100000000001",
      "100000000001",
      "111111111111",
    ],
    { "9,4": { to: "map2", spawn: [1, 4] } }
  ),

  map2: makeMap(
    [
      "111111111111",
      "100000000001",
      "100000000001",
      "D00000000001",
      "100000000001",
      "100000000001",
      "100000000D01",
      "100000000001",
      "111111111111",
    ],
    {
      "0,3": { to: "map1", spawn: [10, 4] },
      "9,6": { to: "map3", spawn: [1, 1] },
    }
  ),

  map3: makeMap(
    [
      "111111111111",
      "1000000000D1",
      "100000000001",
      "100000000001",
      "100000000001",
      "100000000001",
      "100000000001",
      "100000000001",
      "111111111111",
    ],
    { "10,1": { to: "map2", spawn: [9, 6] } }
  ),
};

const mapNames = {
  map1: "แมพที่ 1",
  map2: "แมพที่ 2",
  map3: "แมพที่ 3",
};

function getTile(mapId, x, y) {
  const m = maps[mapId];
  if (y < 0 || y >= m.layout.length) return "1";
  const row = m.layout[y];
  if (x < 0 || x >= row.length) return "1";
  return row[x];
}

function drawMap(ctx, mapId) {
  const m = maps[mapId];
  for (let y = 0; y < m.layout.length; y++) {
    const row = m.layout[y];
    for (let x = 0; x < row.length; x++) {
      const t = row[x];
      let color = "#e8e6dc";
      if (t === "1") color = "#8a8880";
      if (t === "D") color = "#a3623a";
      ctx.fillStyle = color;
      ctx.fillRect(x * TILE, y * TILE, TILE - 1, TILE - 1);
    }
  }
}
