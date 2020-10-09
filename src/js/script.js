import toggleMobileMenu from './modules/togglemenu';

window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    toggleMobileMenu({
        menuBtnSelector: '.menu_button',
        mobileMenuSelector: '.mobile_menu',
        mobileMenuActiveClass: 'show_mobile_menu'
    });
});