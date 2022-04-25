function toggleSideNav() {
    const sidenav = document.getElementById("sidenav");
    
    if(sidenav.offsetWidth == 0) {
        sidenav.style.width = '220px';
        sidenav.style.opacity = "1";
    } else {
        sidenav.style.width = '0';
        sidenav.style.opacity = '0';
    }
}