<script>
	import { API_URL, authfetch } from "../../../api";
	import PrimaryButton from "../../../components/button/PrimaryButton.svelte";


    const download = () => {
        console.log("EXPORT")
        authfetch(`${API_URL()}/export`, {
                method: "GET"
            })
            .then(res => res.blob())
            .then(blob => {
                var file = window.URL.createObjectURL(blob);
                window.location.assign(file);
            })
    }
</script>


<div class="um">
    <PrimaryButton on:click={download}>카탈로그 및 개수를 엑셀 파일로 다운로드</PrimaryButton>
</div>


<style>
    .um {
        display: flex;
        flex-direction: row;
        align-items: start;
        justify-content: start;
        padding: 1em;
    }
</style>
