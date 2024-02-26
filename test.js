function it(msg, fn) { console.assert(fn(), msg); }

window.addEventListener("load", async () => {
    await sleep(500);

    it("should have a title with a corresponding id=\"title\"", () => {
        return document.querySelector("#title") !== undefined;
    });

    it("should have a description with a corresponding id=\"description\"", () => {
        return document.querySelector("#description") !== undefined;
    });

    it("should have rect elements with a corresponding class=\"tile\" that represent the data", () => {
        return document.querySelectorAll("rect.tile").length > 1;
    });

    it("should have at least 2 different fill colors used for the tiles", () => {
        let colors = new Set();
        let tiles = document.querySelectorAll("rect.tile");

        for (let tile of tiles) colors.add(tile.getAttribute("fill"));

        return colors.size >= 2;
    });

    it("each tile should have the properties data-name, data-category, and data-value containing their corresponding name, category, and value", () => {
        let tiles = document.querySelectorAll("rect.tile");

        for (let tile of tiles) {
            if (!tile.dataset.hasOwnProperty("name") ||
                !tile.dataset.hasOwnProperty("category") ||
                !tile.dataset.hasOwnProperty("value")
            ) return false;
        }

        return true;
    });

    it("the area of each tile should correspond to the data-value amount: tiles with a larger data-value should have a bigger area.", () => {
        let tiles = document.querySelectorAll("rect.tile");
        const getArea = (tile) => +tile.getAttribute("width") * +tile.getAttribute("height");

        for (let i = 0; i < tiles.length; i++) {
            for (let j = i + 1; j < tiles.length; j++) {
                if (tiles[i].getAttribute("fill") !== tiles[j].getAttribute("fill")) continue;
                if ((+tiles[i].dataset.value > +tiles[j].dataset.value && getArea(tiles[i]) <= getArea(tiles[j])) ||
                    (+tiles[i].dataset.value < +tiles[j].dataset.value && getArea(tiles[i]) >= getArea(tiles[j])) ||
                    (+tiles[i].dataset.value == +tiles[j].dataset.value && getArea(tiles[i]) != getArea(tiles[j]))
                ) return false;
            }
        }

        return true;
    });

    it("should have a legend with a corresponding id=\"legend\"", () => {
        return document.querySelector("#legend") !== undefined;
    });

    it("legend should have rect elements with a corresponding class=\"legend-item\"", () => {
        return document.querySelectorAll("#legend rect.legend-item").length > 1;
    });

    it("rect elements in the legend should use at least 2 different fill colors", () => {
        let colors = new Set();
        let rects = document.querySelectorAll("#legend rect.legend-item");

        for (let rect of rects) colors.add(rect.getAttribute("fill"));

        return colors.size >= 2;
    });

    let tile = document.querySelectorAll("rect.tile")[0];
    let mOver = new MouseEvent("mouseover");
    let mLeave = new MouseEvent("mouseleave");
    mOver.fromTarget = mLeave.fromTarget = tile;
    tile.dispatchEvent(mOver);

    it("I can mouse over an area and see a tooltip with a corresponding id=\"tooltip\" which displays more information about the area", () => {
        let tooltip = document.querySelector("#tooltip");

        if (!tooltip || tooltip.style.display === "none") return false;

        return true;
    });

    it("should have in the tooltip a data-value property that corresponds to the data-value of the active area", () => {
        let tooltip = document.querySelector("#tooltip");
        
        return +tooltip.dataset.value == +tile.dataset.value;
    });

    tile.dispatchEvent(mLeave);
});

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }