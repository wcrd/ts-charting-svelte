<script>
    // https://observablehq.com/@d3/line-with-tooltip/2?intent=fork
    
    // NOTE: There is something wrong with the date import format. I am parsing to date everywhere, but really should do
    // it once on import and keep the code cleaner.

    import * as d3 from 'd3'
    
    // fixed data
    import aapl from "../../data/aapl.json"

    // define chart bound refs
    let gx;
    let gy;
    let tooltip;
    let tooltipText;
    let tooltipContent = {l1: '', l2: ''};

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

    // $: tooltip_box = tooltipText?.getBBox() || {x: 0, y: 0, width: 0, height: 0}
    
    // TOOLTIP LOGIC

    let tooltip_box = {x: 0, y: 0, width: 0, height: 0}
    
    // helper function to get coords
    // https://d3js.org/d3-array/bisect#bisector_center
    const bisect = d3.bisector(d => Date.parse(d.date.toString())).center

    function handleMouseMove(event){
        // get chart x co-ord (using d3 helper method to get correct value)
        // https://github.com/d3/d3-selection#pointer
        const xChartPos = d3.pointer(event)[0];
        // convert into x axis value domain
        // https://d3js.org/d3-scale/time#scaleUtc
        const xVal = x.invert(xChartPos)
        // Get nearest y val from data source (fixed as 'aapl' in this case)
        const nearest = bisect(aapl, xVal)

        // Set transforms
        tooltip.setAttribute("transform", `translate(${x(Date.parse(aapl[nearest].date.toString()))},${y(aapl[nearest].close)})`)

        // Set text content
        tooltipContent = { l1: formatDate(xVal), l2: formatValue(aapl[nearest].close) }

        // Call bbox update
        tooltip_box = tooltipText.getBBox();
    }

    function handleMouseEnter(){
        tooltip.style.display = null
    }

    function handleMouseLeave(){
        tooltip.style.display = 'none'
    }

    // special value formatters for tooltip
    function formatValue(value) {
        return value.toLocaleString("en", {
        style: "currency",
        currency: "USD"
        });
    }
    
    function formatDate(date) {
        return date.toLocaleString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
        });
    }

    // $: console.debug({tooltip, tooltipText, tooltip_box})

</script>

<div>
    <h3 class="text-xl mb-2">Line Chart with Tooltip</h3>
    <div>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <svg {width} {height} viewBox={[0, 0, width, height].join(", ")} style={"max-width: 100%; height: auto; height: intrinsic;"} on:mousemove={handleMouseMove} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
            <g bind:this={gx} transform={`translate(0,${height - marginBottom})`}></g>
            <g bind:this={gy} transform={`translate(${marginLeft},0)`}></g>
            <path fill='none' stroke='steelblue' stroke-width=1.5 d={line(aapl)}></path>

            <!-- Tooltip -->
            <g bind:this={tooltip} style="display: none">
                <path fill="white" stroke="black" d={`M${-tooltip_box.width / 2 - 10},5H-5l5,-5l5,5H${tooltip_box.width  / 2 + 10}v${tooltip_box.height + 20}h-${tooltip_box.width  + 20}z`}></path>
                <text bind:this={tooltipText} transform={`translate(${-tooltip_box.width / 2},${15 - tooltip_box.y})`}> 
                    <tspan x="0" y="0em" font-weight="bold">{tooltipContent.l1}</tspan>
                    <tspan x="0" y="1.1em">{tooltipContent.l2}</tspan>
                </text>
            </g>
        </svg>
    </div>
</div>