
<div class="header">
    <a class="header-title" href="/dashboard">과학실 물품관리 시스템</a>
    <a href="/dashboard/products">물품 검색</a>
</div>
<div class="container">
<slot/>
</div>

<style>
    .header {
        display: flex;
        height: 3em;
        align-items: center;
        padding: 0.5em;
        gap: 1em;
    }
    .header-title {
        font-size: larger;
        font-weight: bolder;
    }
    a {
        text-decoration: none;
        color: white;
    }
    .container {
        display: flex;
        width: 100%;
        flex: 1;
        background-color: rgb(229, 229, 229);
    }
    .header {
        background-color: #275eb0;
        color: white;
        box-shadow: 0px 0px 10px #275eb0 ;
        z-index: 50;
    }
</style>