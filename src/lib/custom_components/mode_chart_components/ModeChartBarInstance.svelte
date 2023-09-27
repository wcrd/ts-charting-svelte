<script>
    import * as d3 from 'd3'

    // CONTROL VARS
    export let yVar;
    export let xVar = "TimestampId"
    export let zVar = "Value"
    export let optionKey = "OptionsNew"
    export let labelVar = [];

    // DATA (this should come pre-sorted from API)
    export let data = []; // key (yVar): [ts_data]

    // extract the key; or make a default one
    const legendKeyMap = data?.[0]?.[optionKey] || [...(new Set(data.map(d=>d[zVar])))].reduce((acc, c) => {acc[c]="Undefined"; return acc}, {})
    console.debug(legendKeyMap)

    // define chart bound refs
    // let gx;
    let gy;

    export let x; // x-axis scale ref; this is shared by the whole mode chart

    // Declare the chart dimensions and margins.
    export let width = 928;
    export let height = 40;
    const marginTop = 0;
    const marginRight = 30;
    const marginBottom = 0;
    const marginLeft = 40;

    // $: console.debug({yVar})

    // Declare the y (vertical position) scale.
    $: y = d3.scaleBand([yVar], [height - marginBottom, marginTop]).padding([0]);

    // $: console.debug({x, y, gx, gy, xa: xAxis})

    // Call axis calulators
    $: d3.select(gy)
        .call(d3.axisLeft(y).ticks(1))
        .call(g => g.select(".domain").remove())
        // .call(g => g.selectAll(".tick line").clone()
        //     .attr("x2", width - marginLeft - marginRight)
        //     .attr("stroke-opacity", 0.1))

    // series color generator
    $: z = d3.scaleOrdinal([...Array(10).keys()], d3.schemeCategory10);
    // $: console.debug(z)

</script>

<div style:width={`${width}px`}>
    <svg {width} {height} viewBox={[0, 0, width, height].join(", ")} style={"max-width: 100%; height: auto; height: intrinsic;"}>
        <!-- Y-AXIS -->
        <g bind:this={gy} transform={`translate(${marginLeft},0)`}></g>
        <!-- SERIE PLOT -->
        <g transform={`translate(0,${(0)/2})`}>
            {#each data as record}
                <rect x={x(record[xVar])} y={y(record[yVar])} height={y.bandwidth()} width={1} fill={z(record[zVar])}></rect>
            {/each}
        </g>
    </svg>
    <!-- LEGEND -->
    <div class="w-full flex flex-row flex-wrap gap-x-2 max-h-40 overflow-y-scroll" style:padding-left={`${marginLeft}px`}>
        {#each Object.entries(legendKeyMap) as [s_Val, s_Name]}
            <div class="flex flex-row gap-1 items-center">
                <div class="rounded-full w-2 h-2" style:background-color={z(parseInt(s_Val))}></div>
                {s_Name} ({s_Val})
            </div>
        {/each}
    </div>
</div>