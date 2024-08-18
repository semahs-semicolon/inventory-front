<script>
	import { API_URL, authfetch } from '../../../api.js';
	import PrimaryButton from '../../../components/button/PrimaryButton.svelte';
	import Footer from '../../../components/Footer.svelte';
</script>

<div class="tall">
	<div class="um">
		이 페이지에 있는 것들은 카탈로그에 등록이 되어있지만 어느 위치와도 연관되어있지 않은 물품들입니다.
	</div>

	<Footer />
</div>

<style>
	.um {
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: space-between;
		padding: 1em;
		flex: 1;
	}
	.tall {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
