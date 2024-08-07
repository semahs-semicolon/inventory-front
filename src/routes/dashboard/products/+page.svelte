<script>
	import { API_URL, authfetch } from "../../../api";
	import PrimaryButton from "../../../components/button/PrimaryButton.svelte";
	import Footer from "../../../components/Footer.svelte";


    const download = () => {
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


<div class="tall">
    <div class="um">
        <PrimaryButton on:click={download}>카탈로그 및 개수를 엑셀 파일로 다운로드</PrimaryButton>
    </div>


    <Footer/>
</div>


<style>
    .um {
        display: flex;
        flex-direction: row;
        align-items: start;
        justify-content: start;
        padding: 1em;
        flex: 1;
    }
    .tall {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
</style>
