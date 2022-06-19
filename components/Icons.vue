<template>
	<!-- CALENDAR  -->
	<svg v-if="icon == 'cal'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<rect fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" x="48" y="80" width="416" height="384" rx="48" />
		<circle cx="296" cy="232" r="24" fill="currentColor" />
		<circle cx="376" cy="232" r="24" fill="currentColor" />
		<circle cx="296" cy="312" r="24" fill="currentColor" />
		<circle cx="376" cy="312" r="24" fill="currentColor" />
		<circle cx="136" cy="312" r="24" fill="currentColor" />
		<circle cx="216" cy="312" r="24" fill="currentColor" />
		<circle cx="136" cy="392" r="24" fill="currentColor" />
		<circle cx="216" cy="392" r="24" fill="currentColor" />
		<circle cx="296" cy="392" r="24" fill="currentColor" />
		<path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" stroke-linecap="round" d="M128 48v32M384 48v32" />
		<path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M464 160H48" />
	</svg>

	<!-- BAG -->
	<svg v-else-if="icon == 'bag'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 264l-89.6 112-38.4-44.88" />
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M80 176a16 16 0 00-16 16v216c0 30.24 25.76 56 56 56h272c30.24 0 56-24.51 56-54.75V192a16 16 0 00-16-16zM160 176v-32a96 96 0 0196-96h0a96 96 0 0196 96v32" />
	</svg>

	<!-- BIN -->
	<svg v-else-if="icon == 'bin'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
		<path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352" />
		<path d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
	</svg>

	<!-- Pending -->
	<svg v-else-if="icon == 'pending'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<path d="M145.61 464h220.78c19.8 0 35.55-16.29 33.42-35.06C386.06 308 304 310 304 256s83.11-51 95.8-172.94c2-18.78-13.61-35.06-33.41-35.06H145.61c-19.8 0-35.37 16.28-33.41 35.06C124.89 205 208 201 208 256s-82.06 52-95.8 172.94c-2.14 18.77 13.61 35.06 33.41 35.06z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
		<path fill="currentColor" d="M343.3 432H169.13c-15.6 0-20-18-9.06-29.16C186.55 376 240 356.78 240 326V224c0-19.85-38-35-61.51-67.2-3.88-5.31-3.49-12.8 6.37-12.8h142.73c8.41 0 10.23 7.43 6.4 12.75C310.82 189 272 204.05 272 224v102c0 30.53 55.71 47 80.4 76.87 9.95 12.04 6.47 29.13-9.1 29.13z" />
	</svg>

	<!-- REORDER  -->
	<svg v-else-if="icon == 'reorder'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M112 304h288M112 208h288" />
	</svg>

	<!-- ADD  -->
	<svg v-else-if="icon == 'add'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 112v288M400 256H112" />
	</svg>

	<!-- BELL  -->
	<svg v-else-if="icon == 'bell'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512" fill="currentColor">
		<path d="M440.08 341.31c-1.66-2-3.29-4-4.89-5.93-22-26.61-35.31-42.67-35.31-118 0-39-9.33-71-27.72-95-13.56-17.73-31.89-31.18-56.05-41.12a3 3 0 01-.82-.67C306.6 51.49 282.82 32 256 32s-50.59 19.49-59.28 48.56a3.13 3.13 0 01-.81.65c-56.38 23.21-83.78 67.74-83.78 136.14 0 75.36-13.29 91.42-35.31 118-1.6 1.93-3.23 3.89-4.89 5.93a35.16 35.16 0 00-4.65 37.62c6.17 13 19.32 21.07 34.33 21.07H410.5c14.94 0 28-8.06 34.19-21a35.17 35.17 0 00-4.61-37.66zM256 480a80.06 80.06 0 0070.44-42.13 4 4 0 00-3.54-5.87H189.12a4 4 0 00-3.55 5.87A80.06 80.06 0 00256 480z" />
	</svg>

	<!-- ZONE  -->
	<svg v-else-if="icon == 'zone'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M256 96V56M256 456v-40" />
		<path d="M256 112a144 144 0 10144 144 144 144 0 00-144-144z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" />
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M416 256h40M56 256h40" />
	</svg>

	<!-- LOG OUT -->
	<svg v-else-if="icon == 'logout'" :width="size" :height="size" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
		<path d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h152c22.09 0 48 17.91 48 40v40M368 336l80-80-80-80M176 256h256" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
	</svg>

	<!-- QR  -->
	<svg v-else-if="icon == 'qr'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" :width="size" :height="size">
		<rect x="336" y="336" width="80" height="80" rx="8" ry="8" fill="currentColor" />
		<rect x="272" y="272" width="64" height="64" rx="8" ry="8" fill="currentColor" />
		<rect x="416" y="416" width="64" height="64" rx="8" ry="8" fill="currentColor" />
		<rect x="432" y="272" width="48" height="48" rx="8" ry="8" fill="currentColor" />
		<rect x="272" y="432" width="48" height="48" rx="8" ry="8" fill="currentColor" />
		<rect x="336" y="96" width="80" height="80" rx="8" ry="8" fill="currentColor" />
		<rect x="288" y="48" width="176" height="176" rx="16" ry="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
		<rect x="96" y="96" width="80" height="80" rx="8" ry="8" fill="currentColor" />
		<rect x="48" y="48" width="176" height="176" rx="16" ry="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
		<rect x="96" y="336" width="80" height="80" rx="8" ry="8" fill="currentColor" />
		<rect x="48" y="288" width="176" height="176" rx="16" ry="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
	</svg>

	<!-- MAP  -->
	<svg v-else-if="icon == 'map'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<path d="M313.27 124.64L198.73 51.36a32 32 0 00-29.28.35L56.51 127.49A16 16 0 0048 141.63v295.8a16 16 0 0023.49 14.14l97.82-63.79a32 32 0 0129.5-.24l111.86 73a32 32 0 0029.27-.11l115.43-75.94a16 16 0 008.63-14.2V74.57a16 16 0 00-23.49-14.14l-98 63.86a32 32 0 01-29.24.35zM328 128v336M184 48v336" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
	</svg>

	<!-- Share  -->
	<svg v-else-if="icon == 'share'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<path d="M336 192h40a40 40 0 0140 40v192a40 40 0 01-40 40H136a40 40 0 01-40-40V232a40 40 0 0140-40h40M336 128l-80-80-80 80M256 321V48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
	</svg>

	<!-- DONE  -->
	<svg v-else-if="icon == 'done'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 128L192 384l-96-96" />
	</svg>

	<!-- Search  -->
	<svg v-else-if="icon == 'search'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512" fill="currentColor">
		<path d="M456.69 421.39L362.6 327.3a173.81 173.81 0 0034.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 00327.3 362.6l94.09 94.09a25 25 0 0035.3-35.3zM97.92 222.72a124.8 124.8 0 11124.8 124.8 124.95 124.95 0 01-124.8-124.8z" />
	</svg>

	<!-- DOWNLOAD  -->
	<svg v-else-if="icon == 'download'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" fill="currentColor" viewBox="0 0 511.993 511.993">
		<path d="M320 336h76c55 0 100-21.21 100-75.6s-53-73.47-96-75.6C391.11 99.74 329 48 256 48c-69 0-113.44 45.79-128 91.2-60 5.7-112 35.88-112 98.4S70 336 136 336h56M192 400.1l64 63.9 64-63.9M256 224v224.03" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
	</svg>

	<!-- INFO  -->
	<svg v-else-if="icon == 'info'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<path d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" />
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M220 220h32v116" />
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M208 340h88" />
		<path d="M248 130a26 26 0 1026 26 26 26 0 00-26-26z" />
	</svg>

	<!-- STOCK  -->
	<svg v-else-if="icon == 'stock'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<rect x="96" y="48" width="320" height="416" rx="48" ry="48" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" />
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M176 128h160M176 208h160M176 288h80" />
	</svg>

	<!-- RIGHT  -->
	<svg v-else-if="icon == 'right'" xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 512 512">
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M268 112l144 144-144 144M392 256H100" />
	</svg>

	<!-- HOME  -->
	<svg v-else xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
		<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
		<path d="M9 22V12h6v10" />
	</svg>
</template>

<script>
export default {
	props: {
		icon: { type: String },
		size: { type: Number, default: 24 },
	},
};
</script>