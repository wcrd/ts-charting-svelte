<script>
    import * as d3 from 'd3'

    // Get ts data
    // import TSData from '../../data/example_ts_21s_processed/json_records_singleModePoint.json'
    import TSData from "../../data/example_ts_21s_processed/json_records_modePoints_only.json"

    // console.debug({TSData})

    // CONTROL VARS
    let seriesKey = "ObjectPropertyID"
    let xVar = "TimestampId"
    let yVar = "Value"

    // DATA (this should come pre-sorted from API)
    let data = d3.sort(TSData, d => d[xVar])

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
    $: x = d3.scaleUtc(d3.extent(data, d => Date.parse(d[xVar].toString())), [marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    $: y = d3.scaleBand(groups.keys(), [height - marginBottom, marginTop]).padding([0.2]);

    $: console.debug({x, y, gx, gy, xa: xAxis})

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
            .text("Mode Sensor"));

    // $: d3.select(gx).call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
    $: xAxis = d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0)
    $: if(xAxis && gx){ d3.select(gx).call(xAxis) }

    // Declare the line generator.
    const line = d3.line()
        .x(d => x(Date.parse(d[xVar].toString())))
        .y(d => y(d[yVar]));


    // Group the data by series
    const groups = d3.group(data, d => d[seriesKey]);
    // console.debug({groups})

    // series color generator
    $: z = d3.scaleOrdinal(groups.keys(), d3.schemeCategory10);
    $: z2 = d3.scaleOrdinal([...Array(10).keys()], d3.schemeCategory10);


</script>

<div style:width={`${width}px`}>
    <h3 class="text-xl mb-2">Single Mode Point (Data Check)</h3>
    <div>
        <svg {width} {height} viewBox={[0, 0, width, height].join(", ")} style={"max-width: 100%; height: auto; height: intrinsic;"}>
            <g bind:this={gx} transform={`translate(0,${height - marginBottom})`}></g>
            <g bind:this={gy} transform={`translate(${marginLeft},0)`}></g>
            {#each groups as serie}
                <!-- <path fill='none' stroke={z(serie[0])} stroke-width=1.5 d={line(serie[1])}></path> -->
                <!-- Don't have a line generator for rects, need to loop manually -->
                <!-- <g fill={z(serie[0])}> -->
                <g>
                {#each serie[1] as record}
                    <!-- {console.debug(record)} -->
                    <rect x={x(Date.parse(record[xVar].toString()))} y={y(record[seriesKey])} height={y.bandwidth()} width={xAxis.tickSize()/10} fill={z2(record[yVar])}></rect>
                {/each}
                </g>
            {/each}
        </svg>
        <div class="w-full flex flex-row flex-wrap gap-x-2 max-h-40 overflow-y-scroll">
            {#each groups.keys() as serie}
                <div class="flex flex-row gap-1 items-center">
                    <div class="rounded-full w-2 h-2" style:background-color={z(serie)}></div>
                    {serie}
                </div>
            {/each}
        </div>
    </div>
</div>