<button
	{...$$props}
	on:click
	class="rounded-xl border-0 px-4 py-2 text-base font-normal text-white"
>
	<slot />
</button>

<style>
	button {
		background-color: #378ee2;
		cursor: pointer;
		box-shadow: 1px 1px 1px #2c6ec2;
		transition: box-shadow 0.1s;
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
		background-color: #1d1b201d;
		cursor: default;
		color: black;
	}
</style>
