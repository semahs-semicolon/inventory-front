<script>
    export let value = '';
</script>
<textarea type="text" on:change {...$$props} bind:value/>

<style>
    textarea {
        border-radius: 16px;
        padding: 16px;
        background-color: #ECE6F0;
        border-style: none;
    }
</style>