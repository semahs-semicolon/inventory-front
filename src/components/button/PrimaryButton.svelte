
<button {...$$props} on:click>
    <slot/>
</button>


<style>

    button {
        padding: 1em;
        /* flex: 1; */
        background-color: #378ee2;
        border: none;
        cursor: pointer;
        border-radius: 1em;
        box-shadow: 1px 1px 1px #2c6ec2;
        transition: box-shadow 0.1s;
        color: white;
    }
    button:hover {
        background-color: #69aeea;
        box-shadow: 2px 2px 2px #2c6ec2;
    }
    button:active {
        box-shadow: 0px 0px 0px #2c6ec2;
    }
    button:disabled {
        box-shadow: none;
        background-color: #1D1B201D;
        cursor:default;
        color: black;
    }
</style>