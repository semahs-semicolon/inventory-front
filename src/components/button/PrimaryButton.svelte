<button
	class="cursor-pointer rounded-lg border-0 bg-[#378ee2] px-3 py-2 text-white"
	{...$$props}
	on:click
>
	<slot />
</button>

<style>
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
