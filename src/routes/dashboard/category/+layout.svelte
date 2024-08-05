<script>
	import Footer from "../../../components/Footer.svelte";

</script>
<!-- <div>
    몰?루
</div> -->
<div class="wrapper">
    <slot/>
</div>

<style>

    .wrapper {
        flex-direction: column;
		display: flex;
		justify-content: start;
		width: 100%;
		height: 100%;
        overflow-y: scroll;
    }
</style>