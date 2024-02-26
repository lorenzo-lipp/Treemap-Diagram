const ctx = document.createElement("canvas").getContext("2d");
const COLORS = [
    'rgb(216 102 26)',
    '#f44336',
    'rgb(186 63 207)',
    'rgb(131, 83, 216)',
    'rgb(91 110 216)',
    '#2196f3',
    '#03a9f4',
    'rgb(37 198 219)',
    '#009688',
    '#4caf50',
    '#8bc34a',
    '#cddc39',
    'rgb(250 244 74)',
    'rgb(255 94 129)',
    '#ff9800',
    '#ff5722',
    '#dcbeff',
    '#aaffc3',
];

fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
    .then(response => response.json())
    .then((dataGames) => {
        const w = 800;
        const h = 720;
        const TOOLTIP = d3.select('#graph')
            .append('div')
            .attr('id', 'tooltip');
            
        const mouseover = (event) => {
            TOOLTIP.style('display', 'unset');
            d3.select(event.target)
                .style('stroke-width', '1px');
            mousemove(event);
        }
        const mouseleave = (event) => {
            TOOLTIP.style('display', 'none');
            d3.select(event.target)
                .style('stroke-width', '0px');
        }
        const mousemove = (event) => {
            const target = d3.select(event.target)
            TOOLTIP.html(`
                <p class="name">${target.attr('data-name')}</p>
                <p class="category">${target.attr('data-category')}</p>
                <p class="sales">${target.attr('data-value')} million units sold</p>
            `).attr('data-value', target.attr('data-value'))
                .style("top", (event.pageY + 20) + "px")
                .style("left", event.pageX + "px")
        }

        const appendRect = (element, offset, elementClass, enterData) => {
            element.append('rect')
                .attr('x', d => d.x0 + offset)
                .attr('y', d => d.y0 + 70)
                .attr('width', d => d.x1 - d.x0)
                .attr('height', d => d.y1 - d.y0)
                .attr('class', elementClass)
                .attr('data-name', d => d.data.name)
                .attr('data-category', d => d.data.category)
                .attr('data-value', d => d.value)
                .attr('fill', d => COLORS[enterData.children.findIndex(v => v.name === d.parent.data.name)])
                .on('mouseover', mouseover)
                .on('mousemove', mousemove)
                .on('mouseleave', mouseleave);
        }
        const appendText = (element, offset) => {
            element.append('foreignObject')
                .attr('width', d => d.x1 - d.x0)
                .attr('height', d => d.y1 - d.y0)
                .attr('x', d => d.x0 + offset)
                .attr('y', d => d.y0 + 70)
                .attr('class', 'label-container')
                .style('line-height', d => (d.y1 - d.y0) + 'px')
                .append("xhtml:p")
                .text(d => d.data.name)
                .attr('class', 'label')
                .style('font-size', d => getTextSize(d.data.name, d.x1 - d.x0, d.y1 - d.y0));
        }
        const appendLegendNew = (element, elementClass) => {
            element.append('rect')
                .attr('class', elementClass)
                .attr('x', d => d3.select(`rect[data-category="${d.name}"]`).attr('x') - 7)
                .attr('y', d => d3.select(`rect[data-category="${d.name}"]`).attr('y') - 15)
                .attr('rx', 6)
                .attr('width', d => {
                    const x0 = d3.select(`rect[data-category="${d.name}"]`).attr('x');
                    const lastNode = getLastNode(d3.selectAll(`rect[data-category="${d.name}"]`).nodes());
                    const x1 = (+lastNode.attr('x')) + (+lastNode.attr('width'));
                    return x1 - x0 + 14;
                })
                .attr('height', d => {
                    const y0 = d3.select(`rect[data-category="${d.name}"]`).attr('y');
                    const lastNode = getLastNode(d3.selectAll(`rect[data-category="${d.name}"]`).nodes());
                    const y1 = (+lastNode.attr('y')) + (+lastNode.attr('height'));
                    return y1 - y0 + 18;
                })
                .attr('fill', (d, i) => COLORS[i])

            element.append('foreignObject')
                .attr('width', d => {
                    const x0 = d3.select(`rect[data-category="${d.name}"]`).attr('x');
                    const lastNode = getLastNode(d3.selectAll(`rect[data-category="${d.name}"]`).nodes());
                    const x1 = (+lastNode.attr('x')) + (+lastNode.attr('width'));
                    return x1 - x0 + 14;
                })
                .attr('height', d => {
                    const y0 = d3.select(`rect[data-category="${d.name}"]`).attr('y');
                    const lastNode = getLastNode(d3.selectAll(`rect[data-category="${d.name}"]`).nodes());
                    const y1 = (+lastNode.attr('y')) + (+lastNode.attr('height'));
                    return y1 - y0 + 18;
                })
                .attr('x', d => d3.select(`rect[data-category="${d.name}"]`).attr('x') - 7)
                .attr('y', d => d3.select(`rect[data-category="${d.name}"]`).attr('y') - 18)
                .attr('class', 'label-container')
                .append("xhtml:p")
                .text(d => d.name)
                .attr('class', 'label')
                .style('font-size', '13px')
                .style('font-weight', 600);
        }
        
        const rootGames = d3.hierarchy(dataGames)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value);

        d3.treemap()
            .size([w, h])
            .paddingInner(2)
            .paddingOuter(9)
            (rootGames);

        let gamesG = d3.select('svg')
            .selectAll('.tile')
            .data(rootGames.leaves())
            .enter()
            .append('g');
        let legendGames = d3.select('svg')
            .append('g')
            .attr('id', 'legend')
            .lower()
            .selectAll('rect')
            .data(dataGames.children)
            .enter()
            .append('g');
   
        appendRect(gamesG, 0, 'tile', dataGames);
        appendText(gamesG, 0);
        appendLegendNew(legendGames, 'legend-item');

        d3.select('svg')
            .append('text')
            .text('Video Game Sales')
            .style('font-size', '34px')
            .attr('id', 'title')
            .attr('x', (w - d3.select('#title').node().getBBox().width) / 2)
            .attr('y', 34)
        d3.select('svg')
            .append('text')
            .text('Top 100 most sold games grouped by platform')
            .style('font-size', '20px')
            .attr('id', 'description')
            .attr('x', (w - d3.select('#description').node().getBBox().width) / 2)
            .attr('y', 58)
    })

function getTextSize(text, width, height) {
    let fontSize = 10;
    ctx.font = `${fontSize}px Open Sans`;
    let ctxWidth = ctx.measureText(text).width;
    
    while (ctxWidth < width - 40 && fontSize < height - 6) {
        fontSize += 2;
        ctx.font = `${fontSize}px Open Sans`;
        ctxWidth = ctx.measureText(text).width;
    }

    return fontSize + "px";
}

function getLastNode(nodes) {
    return d3.select(nodes[nodes.length - 1]);
}