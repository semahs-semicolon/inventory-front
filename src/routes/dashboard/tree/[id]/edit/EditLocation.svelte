<script>
	import { T } from '@threlte/core';
	import Location3D from '../../../../../components/location3d/Location3D.svelte';
	import { GLTF, Text, TransformControls } from '@threlte/extras';
	import { searchId } from '../../../../../utils/treeManipulation';
	import { createEventDispatcher } from 'svelte';
	import { Vector3 } from 'three';
	import Portal from 'svelte-portal';
	import PrimaryButton from '../../../../../components/button/PrimaryButton.svelte';
	import { get, writable } from 'svelte/store';
	import { ACCESS_TOKEN } from '../../../../../stores/AccessToken.js';
	import { API_URL, modelIdToUrl } from '../../../../../api.js';

	export let location;
	export let id;
	export let depth;

	export let selectedId;

	let realLocation = searchId($location, id);

	let evDispatcher = createEventDispatcher();
	let controls;
	const onKeypress = (ev) => {
		if (controls == undefined) return;
		if (ev.key == 'r') {
			controls.setMode('rotate');
		} else if (ev.key == 't') {
			controls.setMode('translate');
		}
	};

	const onUpdate = (ev) => {
		if (selectedId != $location.id) {
			realLocation.metadata.x = meshTranslation.position.x;
			realLocation.metadata.y = meshTranslation.position.z;
			realLocation.metadata.z = meshTranslation.position.y;

			realLocation.metadata.rx = meshTranslation.rotation.x;
			realLocation.metadata.ry = meshTranslation.rotation.z;
			realLocation.metadata.rz = meshTranslation.rotation.y;
		}
		realLocation.metadata.width = Math.max(0.3, meshResize.position.x);
		realLocation.metadata.height = Math.max(0.3, meshResize.position.z);
		realLocation = realLocation;
		$location = $location;
	};

	$: {
		if (realLocation.metadata.width < 0.3) realLocation.metadata.width = 0.3;
		if (realLocation.metadata.height < 0.3) realLocation.metadata.height = 0.3;
	}

	let meshTranslation;
	let meshResize;

	const uploadFile = (file, progressF1) => {
		return new Promise((resolve, err) => {
			const formData = new FormData();
			formData.append('image', file);

			let token = get(ACCESS_TOKEN);
			var xhr = new XMLHttpRequest();
			xhr.open('POST', `${API_URL()}/images`, true);
			xhr.setRequestHeader('Authorization', 'Bearer ' + token);
			xhr.upload.onprogress = function (e) {
				var percentComplete = Math.ceil((e.loaded / e.total) * 100);
				progressF1.set(percentComplete);
			};

			xhr.onerror = function (e) {
				progressF1.set(undefined);
				// err(e.)
			};
			xhr.onload = function (e) {
				progressF1.set(undefined);
				resolve(JSON.parse(xhr.responseText));
			};
			xhr.send(formData);
		});
	};

	let externalFile, internalFile, testFile;

	let fileupload1, fileupload2;
	let progressF1 = writable(undefined);
	let progressF2 = writable(undefined);

	const uploadF1 = () => {
		if (externalFile != undefined) {
			fileupload1 = uploadFile(externalFile[0], progressF1).then((res) => {
				realLocation.metadata.external = res.id;
				realLocation = realLocation;
				$location = $location;
			});
		}
	};
	const uploadF2 = () => {
		if (internalFile != undefined) {
			fileupload2 = uploadFile(internalFile[0], progressF2).then((res) => {
				realLocation.metadata.internal = res.id;
				realLocation = realLocation;
				$location = $location;
			});
		}
	};
</script>

<svelte:window on:keypress={onKeypress} />

<T.Mesh
	bind:ref={meshTranslation}
	position.x={realLocation.metadata.x}
	position.y={realLocation.metadata.z}
	position.z={realLocation.metadata.y}
	rotation.x={realLocation.metadata.rx ?? 0}
	rotation.y={realLocation.metadata.rz ?? 0}
	rotation.z={realLocation.metadata.ry ?? 0}
>
	<Location3D
		on:click={() => {
			evDispatcher('selection', realLocation.id);
		}}
		location={realLocation}
		forceRender
	>
		{#if testFile != undefined}
			<GLTF url={URL.createObjectURL(testFile[0])} />
		{:else if realLocation.id != $location.id}
			{#if realLocation.metadata.external}
				<GLTF url={modelIdToUrl(realLocation.metadata.external)} />
			{/if}
		{:else if realLocation.metadata.internal}
			<GLTF url={modelIdToUrl(realLocation.metadata.internal)} />
		{/if}
	</Location3D>

	{#if selectedId == realLocation.id}
		{#if selectedId != $location.id}
			<TransformControls object={meshTranslation} bind:controls on:change={onUpdate} translationSnap="0.1" rotationSnap={Math.PI / 4} />
		{/if}

		<T.Mesh
			bind:ref={meshResize}
			let:ref={meshResize}
			position.x={realLocation.metadata.width}
			position.y="0.3"
			position.z={realLocation.metadata.height}
		>
			<T.BoxGeometry args={[0.2, 0.2, 0.2]} />
			<T.MeshStandardMaterial side="DoubleSide" color="yellow" />
			<TransformControls object={meshResize} showY={false} on:change={onUpdate} translationSnap="0.1" space="local" />
		</T.Mesh>
	{/if}

	<T.Mesh position.y={0.1}>
		{#if depth > 1}
			{#each realLocation.children as child}
				<svelte:self {location} id={child.id} depth={depth - 1} on:selection {selectedId} />
			{/each}
		{/if}
	</T.Mesh>
</T.Mesh>

{#if selectedId == realLocation.id}
	<Portal target="#control-attrib">
		<div class="attriblist">
			<span class="attrib">선택됨: <input bind:value={realLocation.name} /></span>
			{#if selectedId != $location.id}
				<h3>위치</h3>
				<span class="attrib">X: <input type="number" bind:value={realLocation.metadata.x} /></span>
				<span class="attrib">Y: <input type="number" bind:value={realLocation.metadata.y} /></span>
				<span class="attrib">Z: <input type="number" bind:value={realLocation.metadata.z} /></span>
				<hr />
				<h3>회전</h3>
				<span class="attrib">Rot X: <input type="number" bind:value={realLocation.metadata.rx} /></span>
				<span class="attrib">Rot Y: <input type="number" bind:value={realLocation.metadata.ry} /></span>
				<span class="attrib">Rot Z: <input type="number" bind:value={realLocation.metadata.rz} /></span>
				<hr />
			{/if}
			<h3>크기</h3>
			<span class="attrib">Width: <input type="number" bind:value={realLocation.metadata.width} /></span>
			<span class="attrib">Height: <input type="number" bind:value={realLocation.metadata.height} /></span>
			<hr />
			<span>Tip: Blender를 사용하여 glTF 파일을 제작하세요!</span>
			{#if $progressF1 != undefined}
				<span class="progress">모델 업로딩중... {$progressF1}%</span>
				<progress value={$progressF1} max="100" />
			{/if}
			<span>외부 구조물: {realLocation.metadata.external}</span>
			<span>외부 구조물 업로딩: <input type="file" bind:files={externalFile} accept=".gltf,.glb" on:change={uploadF1} /></span>
			{#if $progressF2 != undefined}
				<span class="progress">모델 업로딩중... {$progressF2}%</span>
				<progress value={$progressF2} max="100" />
			{/if}
			<span>내부 구조물: {realLocation.metadata.internal}</span>
			<span>내부 구조물 업로딩: <input type="file" bind:files={internalFile} accept=".gltf,.glb" on:change={uploadF2} /></span>

			<span
				>실험 해보기: <input type="file" bind:files={testFile} />
				<PrimaryButton on:click={() => (testFile = undefined)}>clear</PrimaryButton></span
			>
		</div>
	</Portal>
{/if}

<style>
	.attriblist {
		display: flex;
		flex-direction: column;
		padding: 0.5em;
	}
	.attrib {
		display: flex;
	}
	hr {
		margin-left: 0;
		margin-right: 0;
	}
</style>
