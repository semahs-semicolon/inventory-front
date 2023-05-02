<script>
	import { API_URL, authfetch } from "../../../../api";


    let productName;
    let productDesc;

    const create = async () => {
        const res = await authfetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: productName, description: productDesc
            })
        });
        const json = await res.json();
        location.href = `/dashboard/products/${json.id}`
    }
</script>

<h1>
    New Product!
</h1>

<input type="text" placeholder="Type product name" bind:value={productName}>

<span>Product Desc</span>

<textarea bind:value={productDesc}/>

<button on:click={create}>SAVE!</button>