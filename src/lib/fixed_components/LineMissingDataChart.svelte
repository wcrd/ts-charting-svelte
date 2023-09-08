<script>
    import * as d3 from 'd3'

    // import TestData from "../../data/example_ts_21s.json"
    import aapl from "../../data/aapl.json"
    import aaplMissing from "../../data/aaplMissing.json"

    // define chart bound refs
    let gx;
    let gy;

    // Declare the chart dimensions and margins.
    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;

    // Declare the x (horizontal position) scale.
    $: x = d3.scaleUtc(d3.extent(aapl, d => Date.parse(d.date.toString())), [marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    $: y = d3.scaleLinear([0, d3.max(aapl, d => d.close)], [height - marginBottom, marginTop]);

    // Declare the line generator.
    const line = d3.line()
        .defined(d => d.close!==null)
        .x(d => x(Date.parse(d.date.toString())))
        .y(d => y(d.close));
    
    // Call axis calulators
    $: d3.select(gy)
        .call(d3.axisLeft(y).ticks(height / 40))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↑ Daily close ($)"));
    $: d3.select(gx).call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    // // Append a path for the line.
    // svg.append("path")
    //     .attr("fill", "none")
    //     .attr("stroke", "#ccc")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", line(aaplMissing.filter(d => !isNaN(d.close))));

    // // Append a path for the line.
    // svg.append("path")
    //     .attr("fill", "none")
    //     .attr("stroke", "steelblue")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", line(aaplMissing));

    console.debug("line: ", line, "aaplMissing: ", aaplMissing, "x: ", x, "y: ", y, "d3: ", d3, "aapl: ", aapl)
</script>

<div>
    <h3 class="text-xl mb-2">Line Chart with Missing Data support</h3>
    <div>
        <svg {width} {height} viewBox={[0, 0, width, height].join(", ")} style={"max-width: 100%; height: auto; height: intrinsic;"}>
            <g bind:this={gx} transform={`translate(0,${height - marginBottom})`}></g>
            <g bind:this={gy} transform={`translate(${marginLeft},0)`}></g>
            <path fill='none' stroke='#ccc' stroke-width=1.5 d={line(aaplMissing.filter(d => d.close!==null))}></path>
            <path fill='none' stroke='steelblue' stroke-width=1.5 d={line(aaplMissing)}></path>
        </svg>
    </div>
</div>