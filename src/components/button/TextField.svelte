<script>
    export let value = '';
</script>
<input type="text" on:change {...$$props} bind:value/>

<style>
    input {
        height: 46px;
        border-radius: 16px;
        padding: 16px;
        background-color: #ECE6F0;
        border-style: none;
    }
</style>