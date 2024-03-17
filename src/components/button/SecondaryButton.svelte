
<button {...$$props} on:click>
    <slot/>
</button>


<style>

    button {
        padding: 1em;
        /* flex: 1; */
        background-color: #82aa37;
        border: none;
        cursor: pointer;
        border-radius: 1em;
        box-shadow: 1px 1px 1px #5a8325;
        transition: box-shadow 0.1s;
    }
    button:hover {
        background-color: #5a8325;
        box-shadow: 3px 3px 3px #5a8325;
    }
    button:active {
        box-shadow: 0px 0px 0px #5a8325;
    }
    button:disabled {
        box-shadow: none;
        background-color:  #5a8325;
        cursor:default;
    }
</style>