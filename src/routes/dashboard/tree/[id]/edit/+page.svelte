<script>
	import { TransformControls } from "@threlte/extras";
	import OutlineRenderer from "../../../../../components/location3d/OutlineRenderer.svelte";
    import ThreeDMap from "../../../../../components/location3d/ThreeDMap.svelte";
	import { injectParentLink, searchId } from "../../../../../utils/treeManipulation";
	import { setContext } from "svelte";
	import { writable } from "svelte/store";
	import Location3D from "../../../../../components/location3d/Location3D.svelte";
	import EditLocation from "./EditLocation.svelte";
	import PrimaryButton from "../../../../../components/button/PrimaryButton.svelte";
	import { API_URL, authfetch } from "../../../../../api";

    export let data;

    let treeStore = writable(data.tree);

    let tree;

    let selectedLocation = tree;

    let fullTree = {children: data.fullTree};

    let originalMeta;

    const setup = () => {
        tree = injectParentLink( {...data.tree });
        originalMeta = {
            x: tree.metadata.x,
            y: tree.metadata.y,
            z: tree.metadata.z,
            rx: tree.metadata.rx,
            ry: tree.metadata.ry,
            rz: tree.metadata.rz,
        }
        tree.metadata.x = 0;
        tree.metadata.y = 0;
        tree.metadata.z = 0;
        tree.metadata.rx = 0;
        tree.metadata.ry = 0;
        tree.metadata.rz = 0;
        const thing = searchId(fullTree, tree.id);
        thing.children = tree.children;
        selectedLocation = tree;
        fullTree = fullTree;
    }
    $: data.tree, (()=>{
        setup();
        console.log(tree);
        console.log(fullTree);
    })();


    let selection;

    let selectionUpdating;
    $: selectedUpdating = searchId($treeStore, selection?.id)

    
    const save = async (selection) => {
        let meta = selection.metadata;
        if (data.tree.id == selection.id) {
            meta.x = originalMeta.x;
            meta.y = originalMeta.y;
            meta.z = originalMeta.z;
            meta.rx = originalMeta.rx;
            meta.ry = originalMeta.ry;
            meta.rz = originalMeta.rz;
        }
        let res = await authfetch(`${API_URL()}/locations/${selection.id}/metadata`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(meta)
        });
        let json = await res.json();

        res = await authfetch(`${API_URL()}/locations/${selection.id}/name`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({name: selection.name})
        });
        json = await res.json();
        
    }

    const select = (ev) => {
        if (ev.detail == null)  {
            if (selection != undefined)
                save(selection)
            selection = undefined;
        } else {
            if (selection == undefined) selection = searchId(fullTree, ev.detail);
        }
    }
</script>

<div class="wrapper">
    <span class="title">
        <PrimaryButton on:click={() => history.back()}>돌아가기</PrimaryButton> 수정중: {tree.name} | R을 눌러 회전 / T를 눌러 이동
    </span>
    <div class="editor">
        <div class="map">
            <ThreeDMap bind:locations={$treeStore} on:selection={select}>
                <EditLocation location={treeStore} depth=2 id={$treeStore.id}
                        on:selection={select}
                        selectedId={selection?.id}/>
            </ThreeDMap>
        </div>
        <div class="controls">
            <span>제어</span>
            <div id="control-attrib"></div>
        </div>
    </div>
</div>


<style>
    .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow: auto;
        max-width: 100%;
    }
    #control-attrib {
        display: flex;
        flex-direction: column;
    }
    .title {
        padding: 1em;
        background-color: white;
    }
    .map {
        display: flex;
        flex: 1;
        max-width: 100%;
        overflow: auto;
    }
    .controls {
        display: flex;
        
        width: 350px;
        border-style: solid;
        border-color: black;
        border-width: 1px;
        flex-direction: column;
        overflow: auto;
    }
    .editor {
        display: flex;
        flex: 1;
        width: 100%;
        flex-direction: row;
        overflow: auto;
    }
</style>