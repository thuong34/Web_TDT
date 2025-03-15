document.addEventListener("DOMContentLoaded", () =>{    
    const navItems = document.querySelectorAll('.nav-item')
    const tabContents = document.querySelectorAll('.tab-content')
    
    // chuyen tab
    navItems.forEach((item,index)=>{
        item.addEventListener('click',(e)=>{
            document.querySelector('.nav-item.active').classList.remove('active')
            document.querySelector('.tab-content.active').classList.remove('active')
            item.classList.add('active')
            tabContents[index].classList.add('active')
        })
    })

})