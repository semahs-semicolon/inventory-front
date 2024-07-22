<script>
	import { API_URL } from "../../api";
	import PrimaryButton from "../../components/button/PrimaryButton.svelte";
	import TextField from "../../components/button/TextField.svelte";
	import { ACCESS_TOKEN } from "../../stores";

    let username = '', password = '', nickname = '';

    const signup = async () => {
        const resp = await fetch(`${API_URL()}/users/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                nickname: nickname
            })
        })
        if (resp.status == 200) {
            const token = await resp.text();
            $ACCESS_TOKEN = token;

            location.href="/dashboard";
        } else {
            alert(await resp.text());   
        }
    }
</script>

<div class="content">
    <div class="form">
        <h1>SEDA Inventory System</h1>
        <span>사용자 이름</span>
        <TextField type="text" placeholder="username" bind:value={username}/>
        <span>비밀번호</span>
        <TextField type="password" placeholder="password" bind:value={password}/>
        <span>닉네임</span>
        <TextField type="text" placeholder="nickname" bind:value={nickname}/>
        <PrimaryButton on:click={signup}>회원가입</PrimaryButton>
        <a href="/signin">이미 계정이 있으십니까?</a>
    </div>
</div>

<style>
    .content {
        background-image: url("/seda.png");
        background-repeat: no-repeat;
        background-position-y: center;
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: row;
    }
    .form {
        display: flex;
        max-width: 30em;
        background-color: lightblue;
        flex-direction: column;
        align-items: center;
        flex: 1;
        gap: 0.5em;
        border-radius: 2em;
        padding: 1em;
        box-shadow: 0em 0em 0.5em black;
        font-weight: 600;
        font-size: small;
    }
    * {font-family: 'Nanum Gothic', sans-serif;}
</style>