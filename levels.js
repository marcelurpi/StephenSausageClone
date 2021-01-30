
var tile = {
    WATER: 0,
    DIRT: 1,
    GRASS: 2,
    GRILL: 3,
};

var dir = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3,
};

var orient = {
    VERTICAL: 0,
    HORIZONTAL: 1,
};

var levels = [
    {
        name: 'Level 1: The Anchorage',
        level: [
            [ tile.WATER, tile.WATER, tile.WATER, tile.DIRT,  tile.DIRT,  tile.GRASS, tile.DIRT,  tile.DIRT,  tile.DIRT,  tile.DIRT  ],
            [ tile.WATER, tile.WATER, tile.WATER, tile.DIRT,  tile.WATER, tile.GRASS, tile.WATER, tile.WATER, tile.WATER, tile.GRASS ],
            [ tile.WATER, tile.GRILL, tile.GRILL, tile.GRILL, tile.GRILL, tile.DIRT,  tile.WATER, tile.WATER, tile.WATER, tile.GRASS ],
            [ tile.WATER, tile.GRILL, tile.GRILL, tile.GRILL, tile.GRILL, tile.DIRT,  tile.DIRT,  tile.DIRT,  tile.DIRT,  tile.DIRT  ],
            [ tile.WATER, tile.WATER, tile.WATER, tile.WATER, tile.WATER, tile.WATER, tile.WATER, tile.WATER, tile.WATER, tile.WATER ],
            [ tile.GRASS, tile.GRASS, tile.GRILL, tile.GRILL, tile.WATER, tile.WATER, tile.WATER, tile.WATER, tile.WATER, tile.WATER ],
        ],
        sausages: [
            { orient: orient.VERTICAL,   pos: { x: 5, y: 2 } },
            { orient: orient.VERTICAL,   pos: { x: 6, y: 2 } },
            { orient: orient.VERTICAL,   pos: { x: 7, y: 2 } },
        ],
        player: { dir: dir.UP, pos: { x: 9, y: 3 } },
    },
    {
        name: 'Level 2: Bay\'s Neck',
        level: [
            [ tile.GRASS, tile.GRASS, tile.GRILL, tile.GRASS ],
            [ tile.WATER, tile.GRASS, tile.WATER, tile.GRASS ],
            [ tile.GRASS, tile.GRILL, tile.GRASS, tile.GRASS ],
            [ tile.GRASS, tile.GRASS, tile.GRASS, tile.WATER ],
        ],
        sausages: [
            { orient: orient.VERTICAL,   pos: { x: 0, y: 2 } },
        ],
        player: { dir: dir.LEFT, pos: { x: 3, y: 2 } },
    },
    {
        name: 'Level 3: Burning Wharf',
        level: [
            [ tile.DIRT,  tile.DIRT,  tile.DIRT,  tile.DIRT,  tile.DIRT,  tile.DIRT ],
            [ tile.GRASS, tile.DIRT,  tile.GRILL, tile.GRILL, tile.WATER, tile.DIRT ],
            [ tile.WATER, tile.WATER, tile.GRILL, tile.GRILL, tile.WATER, tile.DIRT ],
        ],
        sausages: [
            { orient: orient.VERTICAL,   pos: { x: 1, y: 1 } },
            { orient: orient.HORIZONTAL, pos: { x: 2, y: 0 } },
        ],
        player: { dir: dir.RIGHT, pos: { x: 0, y: 0 } },
    },
    {
        name: 'Level 4: The Clover',
        level: [
            [ tile.WATER, tile.GRASS, tile.GRASS, tile.DIRT,  tile.DIRT,  tile.DIRT,  tile.DIRT  ],
            [ tile.WATER, tile.GRILL, tile.GRILL, tile.WATER, tile.WATER, tile.WATER, tile.GRASS ],
            [ tile.WATER, tile.GRILL, tile.GRILL, tile.WATER, tile.GRILL, tile.GRILL, tile.GRASS ],
            [ tile.DIRT,  tile.GRASS, tile.GRASS, tile.GRASS, tile.GRILL, tile.GRILL, tile.GRASS ],
            [ tile.WATER, tile.GRILL, tile.GRILL, tile.DIRT,  tile.DIRT,  tile.DIRT,  tile.DIRT  ],
            [ tile.WATER, tile.GRILL, tile.GRILL, tile.DIRT,  tile.WATER, tile.WATER, tile.WATER ],
            [ tile.WATER, tile.GRASS, tile.GRASS, tile.DIRT,  tile.WATER, tile.WATER, tile.WATER ],
        ],
        sausages: [
            { orient: orient.HORIZONTAL, pos: { x: 1, y: 0 } },
            { orient: orient.HORIZONTAL, pos: { x: 1, y: 6 } },
            { orient: orient.VERTICAL,   pos: { x: 6, y: 2 } },
        ],
        player: { dir: dir.RIGHT, pos: { x: 0, y: 3 } },
    },
    {
        name: 'Level 5: Comely Hearth',
        level: [
            [ tile.WATER, tile.WATER, tile.GRASS, tile.DIRT,  tile.GRASS ],
            [ tile.DIRT,  tile.DIRT,  tile.DIRT,  tile.DIRT,  tile.DIRT  ],
            [ tile.GRASS, tile.GRASS, tile.GRILL, tile.GRASS, tile.WATER ],
            [ tile.GRASS, tile.GRILL, tile.GRILL, tile.GRASS, tile.WATER ],
            [ tile.GRASS, tile.GRASS, tile.GRASS, tile.WATER, tile.WATER ],
        ],
        sausages: [
            { orient: orient.HORIZONTAL, pos: { x: 0, y: 2 } },
            { orient: orient.HORIZONTAL, pos: { x: 3, y: 2 } },
        ],
        player: { dir: dir.LEFT, pos: { x: 2, y: 1 } },
    },
    {
        name: 'Level 6: Maiden\'s Walk',
        level: [
            [ tile.GRILL, tile.DIRT,  tile.DIRT,  tile.GRILL ],
            [ tile.GRILL, tile.GRASS, tile.DIRT,  tile.GRASS ],
            [ tile.WATER, tile.DIRT,  tile.DIRT,  tile.DIRT  ],
            [ tile.DIRT,  tile.DIRT,  tile.WATER, tile.WATER ],
        ],
        sausages: [
            { orient: orient.VERTICAL, pos: { x: 1, y: 0 } },
        ],
        player: { dir: dir.UP, pos: { x: 2, y: 2 } },
    },
];

for (let level of levels) {
    level.sausages = level.sausages.map(function(sausage) {
        sausage.grilled = [ false, false, false, false ];
        return sausage;
    });
}
