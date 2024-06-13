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
    이 페이지에 있는 것들은 카탈로그에 등록이 되어있지만
    어느 위치와도 연관되어있지 않은 물품들입니다.

    
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
