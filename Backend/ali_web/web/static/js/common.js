function createXhr() {
    if(window.XMLHttpRequest){
        return new XMLHttpRequest();
    }else{
        return new ActiveXObject("Micorsoft.XMLHTTP");
    }
}