<script>
	import { prevent_default } from "svelte/internal";
	import ContextMenu from "../../components/ContextMenu.svelte";
	import LocationView from "../../components/location/LocationView.svelte";
	import { findsParent, injectParentLink, searchId } from "../../utils/treeManipulation";
	import { API_URL, authfetch } from "../../api";
	import TreeView from "../../components/TreeView.svelte";
	import { goto } from "$app/navigation";
	import PrimaryButton from "../button/PrimaryButton.svelte";


    export let rootTree;
    export let selectedLocation;
    export let hoveredLocation;

    let currentUpdates = {};

    let editing = false;



    const dimension = (e) => {
        currentUpdates[e.detail.locationId] = e.detail;
    }



    const save = async (e) => {
        const res = await authfetch(`${API_URL()}/locations/layout`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.values(currentUpdates))
        });
        const json = await res.json();
        currentUpdates = {};
        rootTree.children = searchId({children: json}, rootTree.id).children;
        rootTree = injectParentLink(rootTree);
    }

    const create = async (tree) => {
        const name = prompt("name?");
        const res = await authfetch(`${API_URL()}/locations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                x: 0,
                y: 0,
                width: 30,
                height: 30,
                parent: tree.id
            })
        });
        const json = await res.json();
        tree.children = [...tree.children, {...json, children: [], parent: tree}];


        rootTree = rootTree;
    }
    const rename = async (tree) => {
        const name = prompt("name?");
        const res = await authfetch(`${API_URL()}/locations/${tree.id}/name`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name
            })
        });
        const json = await res.json();
        tree.name = name;

        rootTree = rootTree;
    }

    const doDelete = async (tree) => {
        if (!confirm("you sure?")) return;
        const res = await authfetch(`${API_URL()}/locations/${tree.id}`, {
            method: "DELETE"
        });
        if (res.status !== 200)
            alert(await res.text());
        else
            tree.parent.children = tree.parent.children.filter(elem => elem.id !== tree.id);
        rootTree = rootTree;
    }

    const saveLocationBackground = async (tree, image) => {
        let stuff = undefined;
        if (image != undefined) {
           const formData = new FormData();
            formData.append("image", image);
            const req1 = await authfetch(`${API_URL()}/images`, {
                method: 'POST',
                body: formData
            });
            const fileData = await req1.json();
            stuff = fileData.id;
        }

        const res = await authfetch(`${API_URL()}/locations/${tree.id}/background`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                imageId: stuff
            })
        });
        const data = await res.json();
        tree.backgroundId = stuff;

        background = undefined;
        image = undefined;

        rootTree = rootTree;
    }

    let background = undefined;
    let image = undefined;
    let src;
    $: {
        if (image?.[0] != undefined) {
            src = URL.createObjectURL(image[0]);
        } else {
            src = undefined;
        }
    }
    let tree = {};
</script>



<div class="relative">
    <slot/>
    <LocationView tree={rootTree} movable={false} on:dimension={dimension} parentId={null} editing={editing}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <ContextMenu slot="background" let:tree  let:startDrag  let:onContextMenu>
                <div slot="menu" class="menu" >
                    <span>{tree.name}</span>
                    <hr/>
                    <PrimaryButton on:click={() => create(tree)}>새로 위치 만들기</PrimaryButton>
                    <PrimaryButton on:click={() => rename(tree)}>이름 바꾸기</PrimaryButton>
                    <PrimaryButton on:click={() => doDelete(tree)}>삭제하기</PrimaryButton>
                    {#if editing}
                        <PrimaryButton on:click={() => {editing = false;  save();}}>이동 멈추기</PrimaryButton>
                    {:else}
                        <PrimaryButton on:click={() => {editing = true;}}>이동 하기</PrimaryButton>
                    {/if}
                    {#if tree?.id !== undefined}
                        {#if tree?.id == background}
                            <PrimaryButton on:click={() => {background = undefined; image=undefined;}}>배경설정 취소</PrimaryButton>
                            <PrimaryButton on:click={() => saveLocationBackground(tree, image == undefined || image.length == 0 ? null : image[0])}>배경 저장</PrimaryButton>
                        {:else}
                            <PrimaryButton on:click={() => {background = tree.id; image=undefined;}}>배경 설정</PrimaryButton>
                        {/if}
                    {/if}
                </div>
                <label for="background">
                    <div class:hovered={hoveredLocation != null && hoveredLocation?.id == tree?.id}
                    class:selected = {selectedLocation != null && selectedLocation?.id == tree?.id}
                    on:dblclick={() => { if (tree.id != null) goto(`/dashboard/tree/${tree.id}`)}}
                    on:mouseenter={tree != rootTree && (() => hoveredLocation = tree)}
                    on:mouseleave={() => hoveredLocation = null}
                    on:click={() => {if (tree?.id === selectedLocation?.id) {selectedLocation = null;} else if (tree?.id != null) {selectedLocation = tree} else {selectedLocation=null;}}}
                                

                    class="background" on:contextmenu|self={onContextMenu} on:drop={(e) => {
                        if (e.dataTransfer.types.includes("seda/location")) {
                            e.preventDefault();
                            const dataStr = e.dataTransfer.getData("seda/location");
                            if (dataStr == undefined) return;
                            
                            const theElement = searchId(rootTree, dataStr);
                            if (findsParent(tree, theElement.id)) {
                                alert("I'm not letting you put parent into child")   
                                return;
                            }
                            console.log(theElement);
                            theElement.parent.children = theElement.parent.children.filter(elem => elem.id !== dataStr);
                            tree.children = [...tree.children, theElement];
                            theElement.parent = tree;
                            
                            rootTree = rootTree;

                            currentUpdates[theElement.id] = {
                                locationId: theElement.id,
                                x: theElement.x,
                                y: theElement.y,
                                width: theElement.width,
                                height: theElement.height,
                                parentId: theElement.parent.id
                            }
                        } else if (e.dataTransfer.types.includes("seda/product")) {
                            e.preventDefault();
                            const dataStr = e.dataTransfer.getData("seda/product");
                            if (dataStr == undefined) return;
                            const data = JSON.parse(dataStr);
                            const count = parseInt(prompt("count?"));
                            
                            authfetch(`${API_URL()}/items`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    productId: data.id,
                                    locationId: tree.id,
                                    count: count
                                })
                            }).then(a => {
                                selectedLocation = tree;
                            })
                        }
                    }} on:dragover={(ev) => {
                        ev.preventDefault();
                        if (ev.dataTransfer.types.includes("seda/location")) {
                            hoveredLocation = tree;
                            ev.dataTransfer.dropEffect="move";
                            return true;
                        } else if (ev.dataTransfer.types.includes("seda/product") && tree.id != null) {
                            hoveredLocation = tree;
                            ev.dataTransfer.dropEffect="copy";
                            return true;
                        } else {
                            ev.dataTransfer.dropEffect="none";
                            return false;
                        }
                    }}>
                            <div class="title"  class:realtitle={tree?.id != null}
                                class:draggable={editing && tree.id !== null}
                                class:selected={selectedLocation != null &&selectedLocation?.id == tree?.id}
                                class:hovered={hoveredLocation != null && hoveredLocation?.id == tree?.id}
                                
                                on:mousedown={editing && tree != rootTree && startDrag}
                                
                                draggable={!editing} on:dragstart={(e) => {
                                    e.dataTransfer.setData("seda/location", tree.id);
                                }}>
                                    <span>{tree.name}</span>
                            </div>
                            {#if tree?.id != null && background == tree?.id}
                                <div class="backgroundSelect">
                                    {#if image == undefined || src == null}
                                        <img src="/add_a_photo_outlined.svg" alt="upload"/>
                                    {:else}
                                        <img src={src} alt="uploaded"/>
                                    {/if}
                                </div>
                                <input id="background" type="file" bind:files={image} hidden/>
                            {/if}
                    </div>
                </label>
            </ContextMenu>
    </LocationView>
</div>

<style>
    .backgroundSelect {
        z-index: 30;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
    }
    .backgroundSelect > img {
        width: 100%;
        height: 100%;
    }

    .menu {
        display: flex;
        gap: 0.5em;
        flex-direction: column;
    }
    .float-view {
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 100;
    }
    .background {
        width: 100%;
        height: 100%;
    }
    label {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
    }
    .relative {
        position: relative;
        flex: 1;
        overflow: auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: stretch;
        align-items: stretch;
        height: 100%;
        max-width: 700px;
    }
    .background {
        width: 100%;
        height: 100%;
    }
    .hovered {
        background-color: #91ba3f4D !important;
    }
    .selected {
        background-color: #378ee24D;
    }


    .title {
        display: flex;
        padding: 0.5em;
        cursor: pointer;
    }
    .realtitle:hover {
        background-color: #91ba3f4D;
    }
    .title > span {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .draggable {
        cursor: grab;
        background-color: rgba(255, 166, 0, 0.825);
    }
    .navigatable {
        cursor: pointer;
        background-color: greenyellow;
    }
    .draggable:active {
        cursor: grabbing;
    }

hr {
    align-self: auto;
    flex-direction: column;
    margin: 0;
}
</style>