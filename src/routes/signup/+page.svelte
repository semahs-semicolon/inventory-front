<script>
	import { API_URL } from "../../api";
	import { ACCESS_TOKEN } from "../../stores";

    let username = '', password = '', nickname = '';

    const signup = async () => {
        const resp = await fetch(`${API_URL()}/users/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
        <span>Username</span>
        <input type="text" placeholder="username" bind:value={username}/>
        <span>Password</span>
        <input type="password" placeholder="password" bind:value={password}/>
        <span>Nickname</span>
        <input type="text" placeholder="nickname" bind:value={nickname}/>
        <button on:click={signup}>Sign Up</button>
        <a href="/signin">Already have an account?</a>
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