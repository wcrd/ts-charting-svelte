<script>
    import LineChart from "$lib/reusable_components/LineChart.svelte";
    import ModeChart from "$lib/custom_components/ModeChart.svelte";

    import TSData from '../../data/example_ts_21s_processed/json_records_singleModePoint.json'
</script>

<LineChart chartTitle="Check data with line plot" data={TSData} seriesKey="ObjectPropertyID" xVar="TimestampId" yVar="Value"></LineChart>

<hr>
<p>To make this chart, I am going to swap the axes and plot this like a bar, with each mode a different color</p>

<ModeChart></ModeChart>