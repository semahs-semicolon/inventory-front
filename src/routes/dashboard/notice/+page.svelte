<script>
	import PrimaryButton from "../../../components/button/PrimaryButton.svelte";
import Footer from "../../../components/Footer.svelte";

</script>


<div class="tall">
    <div class="wrapper">
        <span class="title">공지

            <PrimaryButton>글 쓰기</PrimaryButton>
        </span>
        <hr/>
    </div>
<Footer/>
</div>

<style>
    .wrapper {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 1em;
        padding-bottom: 0;
        max-width: 1000px;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        background-color: #FFFFFF;
    }
    .tall {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        flex: 1;
    }
    .title {
        display: flex;
        font-size: 1.5em;
        gap: 0.5em;
        justify-content: space-between;
    }
    hr {
        margin-left: 0;
        margin-right: 0;
    }
</style>
