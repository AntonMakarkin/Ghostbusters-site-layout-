const toggleMobileMenu = ({menuBtnSelector, mobileMenuSelector, mobileMenuActiveClass}) => {
    const menuBtn = document.querySelector(menuBtnSelector),
          mobileMenu = document.querySelector(mobileMenuSelector);

          console.log(menuBtn);

    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('menu_button_active');
        mobileMenu.classList.toggle(mobileMenuActiveClass);
    });

    /*mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle(mobileMenuActiveClass);
    });*/

};

export default toggleMobileMenu;