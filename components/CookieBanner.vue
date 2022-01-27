<template>
    <transition name="scale-y">
        <CookieControl ref="cookiecontrol" v-if="loaded">
            <template v-slot:bar>
                <div class="right-8 bottom-8 left-8 z-10 fixed">
                    <div
                        class="border flex flex-col mx-auto bg-gray-800 border-gray-800 rounded-3xl shadow-xl text-white text-center text-xs w-full max-w-[720px] py-3 px-4 gap-4 items-center justify-center relative md:flex-row md:text-sm md:text-left md:px-6 md:gap-6"
                    >
                        <div
                            class="rounded-full bg-[#141d2a] p-0.5 -top-4 -left-4 text-orange-400 absolute md:static"
                        >
                            <svg
                                viewBox="0 0 512 512"
                                width="36"
                                height="36"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fill="currentColor"
                                    d="M466.5376,250.3356c-.2313-8.3766-8.2694-14.8078-16.376-12.6955a57.5807,57.5807,0,0,1-55.1994-14.8935,58.98,58.98,0,0,1-6.8554-8.3937,13.7161,13.7161,0,0,0-14.9021-5.7757A57.3178,57.3178,0,0,1,303.4889,138.84a13.7245,13.7245,0,0,0-5.7758-14.8892,56.5137,56.5137,0,0,1-8.3122-6.8554,57.3,57.3,0,0,1-14.9235-55.0709c2.1209-8.1451-4.349-16.1917-12.764-16.4188a209.89,209.89,0,0,0-154.6551,61.5749c-84.5922,84.5922-82.1371,223.1455,7.1939,304.6656,79.8534,72.8351,203.6674,72.8351,283.5208,0A209.9871,209.9871,0,0,0,466.5376,250.3356Zm-296.6318-7.0012a46.0255,46.0255,0,1,1,55.315-55.3365A45.7083,45.7083,0,0,1,169.9058,243.3344Zm66.9608,111.98a26.8273,26.8273,0,1,1-31.4838-31.9422A26.8434,26.8434,0,0,1,236.8666,355.3142Zm151.0945-53.0485a34.5,34.5,0,1,1-39.5132-39.53A34.6558,34.6558,0,0,1,387.9611,302.2657Z"
                                />
                            </svg>
                        </div>
                        <span
                            class="font-light flex-1 z-10"
                        >We use cookies to ensure that we give you the best experience on our website. If you continue to use this site we will assume that you are happy with it.</span>
                        <button
                            class="border bg-[#141d2a] border-gray-700 rounded-2xl w-full p-2 md:w-auto md:p-3"
                            @click="accept"
                        >
                            <span class="font-light whitespace-nowrap">Got it</span>
                        </button>
                    </div>
                </div>
            </template>
        </CookieControl>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            loaded: true,
        }
    },
    methods: {
        accept() {
            const btn = document.querySelector('.cookieControl__BarButtons button:last-child');
            btn.click();
            console.log(this.$refs.cookiecontrol.cookies.consent);
        },
        showCookieBar() {
            console.log('showCookieBar');
            this.loaded = true;
            console.log(this.$refs.cookiecontrol.cookies.consent);
        },
        handleScroll() {
            if (window.pageYOffset > 0) {
                this.showCookieBar();
                window.removeEventListener('scroll', this.handleScroll)
            }
        }
    },
    mounted() {
        console.log(this.$refs.cookiecontrol.cookies.consent);
        if (this.loaded) return;


        window.addEventListener('scroll', this.handleScroll)

        if (process.client) {
            console.log('CookieBanner mounted');
            window.requestIdleCallback(callback => {
                setTimeout(() => {
                    this.showCookieBar();
                }, 5000);
            });
        }
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    watch: {
        $route(to, from) {
            if (this.$refs.cookiecontrol && this.$refs.cookiecontrol.cookies.consent == false) {
                this.accept();
            }
        }
    }
}
</script>

<style lang="postcss">
.cookieControl__ControlButton,
.cookieControl__BarButtons {
    display: none;
}
</style>