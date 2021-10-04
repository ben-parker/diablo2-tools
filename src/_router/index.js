import Vue from 'vue'
import VueRouter from 'vue-router'
import ImbueCalculator from "../views/ImbueCalculator"
import SimpleImbueCalculator from "../views/SimpleImbueCalculator"

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        redirect: "/imbue-calculator",
        name: "home",
        component: ImbueCalculator,
    },
    {
        path: "/imbue-calculator",
        name: "imbue-calculator",
        component: ImbueCalculator,
    },
    {
        path: "/imbue-affix-level-calculator",
        name: "simple-imbue-calculator",
        component: SimpleImbueCalculator,
    },
];

const router = new VueRouter({
    base: '/diablo2-tools',
    mode: 'history',
    routes
});

export default router;
