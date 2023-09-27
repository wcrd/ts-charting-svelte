<script>
    import ModeChartBarInstance from "$lib/custom_components/mode_chart_components/ModeChartBarInstance.svelte";

    // import TSData from "../../data/example_ts_21s_processed/json_records_singleModePoint.json"
    import TSData from "../../data/example_ts_21s_processed/json_records_modePoints_only.json"
    import { convertDateTime } from "$lib/utils/helpers"
    import * as d3 from 'd3'
	import { onMount } from "svelte";

    // DEBUG
    onMount(() => {
        const DEBUG = {
            d3,
            TSData,
            data,
            convertDateTime
        }
        window.DEBUG = DEBUG
    })

    // CONTROL VARS
    let yVar = "ObjectPropertyID"
    let xVar = "TimestampId"
    let zVar = "Value"
    
    // DATA (this should come pre-sorted from API)
    export let data = convertDateTime(TSData);
    // Need to clean here for now
    data = d3.sort(data, d => d[xVar])
    // Group by y-variable
    const groups = d3.group(data, d => d[yVar]);
    
    const width = 928;
    const height = 40;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;


    // SVG
    let gx; // x-axis svg group

    // INITIAL PROCESSINGS
    // Get x-axis extents
    // Declare the x (horizontal position) scale.
    $: x = d3.scaleUtc(d3.extent(data, d => d[xVar]), [marginLeft, width - marginRight]);
    $: xAxis = d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0)
    $: if(xAxis && gx){ d3.select(gx).call(xAxis) }

</script>


<div style:width={`${width}px`}>
    <!-- TITLE -->
    <h3 class="text-xl mb-2">Mode Chart - Componentised</h3>
    <div>
        <!-- MODE BARS -->
        {#each groups as barData}
            <ModeChartBarInstance {
                ...{
                    yVar: barData[0], 
                    data: barData[1], 
                    x,
                    width,
                    height
                }
            }></ModeChartBarInstance>
        {/each}
        <!-- X-AXIS -->
        <svg {width} {height} viewBox={[0, 0, width, height].join(", ")} style={"max-width: 100%; height: auto; height: intrinsic;"}>
            <g bind:this={gx} transform={`translate(0,${height - marginBottom})`}></g>
        </svg>
    </div>
</div>